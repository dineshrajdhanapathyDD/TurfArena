import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime'

const client = new BedrockRuntimeClient({ region: 'us-east-1' })

async function testModel(modelId: string) {
  console.log(`\n🧪 Testing model: ${modelId}`)
  
  try {
    const payload = {
      messages: [{ role: 'user', content: [{ text: 'Say "Hello TurfArena" in one sentence.' }] }],
      inferenceConfig: { maxTokens: 50, temperature: 0.7 },
    }

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    })

    const response = await client.send(command)
    const body = JSON.parse(new TextDecoder().decode(response.body))
    const text = body?.output?.message?.content?.[0]?.text || JSON.stringify(body).slice(0, 200)
    console.log(`✅ Response: ${text}`)
    return true
  } catch (error: any) {
    console.log(`❌ Error: ${error.name} — ${error.message.slice(0, 100)}`)
    return false
  }
}

async function main() {
  console.log('🏟️ TurfArena — Amazon Bedrock Model Test')
  console.log('   Region: us-east-1\n')

  // Try models in order of preference
  const models = [
    'us.amazon.nova-micro-v1:0',
    'amazon.nova-micro-v1:0',
    'us.amazon.nova-lite-v1:0',
    'amazon.nova-lite-v1:0',
    'amazon.titan-text-lite-v1',
    'amazon.titan-text-express-v1',
  ]

  for (const model of models) {
    const success = await testModel(model)
    if (success) {
      console.log(`\n🎉 Working model found: ${model}`)
      console.log(`   Add to .env: BEDROCK_MODEL_ID=${model}`)
      break
    }
  }
}

main()
