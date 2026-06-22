@echo off
cd /d "d:\github work\Turfarena"
echo|set /p="us-east-1" | vercel env add AWS_REGION production
echo|set /p="AKIAWZLAF4ABDGAB4252" | vercel env add AWS_ACCESS_KEY_ID production
echo|set /p="V1T0EznMvVvS+qiyfDdLGpXI1z7iuhZL32hGVLoP" | vercel env add AWS_SECRET_ACCESS_KEY production
