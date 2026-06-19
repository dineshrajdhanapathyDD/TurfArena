'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Share2, Send, ImageIcon, Trophy, Flame, Award, Radio, X } from 'lucide-react'
import { AppShell, PageHeader } from '@/components/app-shell'
import { BottomNav } from '@/components/bottom-nav'
import { feedPosts, type FeedPost } from '@/lib/data'

const typeColors: Record<FeedPost['type'], { bg: string; text: string; icon: typeof Trophy }> = {
  'Match Result': { bg: 'bg-success/15', text: 'text-success', icon: Radio },
  'Tournament Update': { bg: 'bg-primary/15', text: 'text-primary', icon: Trophy },
  'Achievement': { bg: 'bg-warning/15', text: 'text-warning', icon: Award },
  'Highlight Reel': { bg: 'bg-accent/15', text: 'text-accent', icon: Flame },
}

const postTypes: FeedPost['type'][] = ['Match Result', 'Achievement', 'Tournament Update', 'Highlight Reel']

export default function CommunityPage() {
  const [posts, setPosts] = useState(feedPosts)
  const [newPost, setNewPost] = useState('')
  const [newPostType, setNewPostType] = useState<FeedPost['type']>('Match Result')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [commentingOn, setCommentingOn] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState<Record<string, { author: string; text: string }[]>>({})

  function handleLike(postId: string) {
    setLikedPosts((prev) => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: likedPosts.has(postId) ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
  }

  function handlePost() {
    if (!newPost.trim()) return
    const post: FeedPost = {
      id: `f${Date.now()}`,
      author: 'You',
      avatar: '/images/player-1.png',
      time: 'Just now',
      type: newPostType,
      content: newPost.trim(),
      likes: 0,
      comments: 0,
    }
    setPosts((prev) => [post, ...prev])
    setNewPost('')
  }

  function handleComment(postId: string) {
    if (!commentText.trim()) return
    setComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { author: 'You', text: commentText.trim() }],
    }))
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p))
    )
    setCommentText('')
  }

  return (
    <AppShell>
      <PageHeader title="Community" subtitle="What's happening in your sports circle" />

      {/* Create Post */}
      <section className="px-5 pt-2">
        <div className="glass rounded-[20px] p-4">
          <div className="flex gap-3">
            <Image
              src="/images/player-1.png"
              alt="You"
              width={40}
              height={40}
              className="size-10 rounded-full object-cover shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share a match update, achievement, or highlight..."
                rows={2}
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {/* Post type chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {postTypes.map((type) => {
                  const info = typeColors[type]
                  return (
                    <button
                      key={type}
                      onClick={() => setNewPostType(type)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                        newPostType === type
                          ? `${info.bg} ${info.text}`
                          : 'bg-surface-2 text-muted-foreground'
                      }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ImageIcon className="size-4" />
                  Photo
                </button>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-40"
                >
                  <Send className="size-3.5" />
                  Post
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <section className="px-5 pt-4 space-y-4 pb-4">
        <AnimatePresence mode="popLayout">
          {posts.map((post, i) => {
            const typeInfo = typeColors[post.type]
            const Icon = typeInfo.icon
            const isLiked = likedPosts.has(post.id)

            return (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-[20px] overflow-hidden"
              >
                {/* Post header */}
                <div className="flex items-center gap-3 p-4 pb-0">
                  <Image
                    src={post.avatar}
                    alt={post.author}
                    width={40}
                    height={40}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{post.author}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground">{post.time}</span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${typeInfo.bg} ${typeInfo.text}`}>
                        <Icon className="size-2.5" />
                        {post.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post content */}
                <div className="px-4 pt-3">
                  <p className="text-sm leading-relaxed text-foreground/90">{post.content}</p>
                </div>

                {/* Post image */}
                {post.image && (
                  <div className="relative mt-3 h-44 w-full">
                    <Image
                      src={post.image}
                      alt="Post media"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-6 px-4 py-3">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                      isLiked ? 'text-danger' : 'text-muted-foreground hover:text-danger'
                    }`}
                  >
                    <Heart className={`size-4 ${isLiked ? 'fill-danger' : ''}`} />
                    {post.likes}
                  </motion.button>
                  <button
                    onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="size-4" />
                    {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="size-4" />
                    Share
                  </button>
                </div>

                {/* Comments section */}
                <AnimatePresence>
                  {commentingOn === post.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="px-4 py-3 space-y-2">
                        {(comments[post.id] || []).map((c, ci) => (
                          <div key={ci} className="flex gap-2">
                            <span className="size-6 rounded-full bg-surface-2 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {c.author[0]}
                            </span>
                            <div>
                              <span className="text-xs font-semibold">{c.author}</span>
                              <p className="text-xs text-muted-foreground">{c.text}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleComment(post.id) }}
                            placeholder="Write a comment..."
                            className="flex-1 h-9 rounded-full bg-surface-2 px-3 text-xs outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30"
                          />
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleComment(post.id)}
                            disabled={!commentText.trim()}
                            className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
                          >
                            <Send className="size-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            )
          })}
        </AnimatePresence>
      </section>

      <BottomNav />
    </AppShell>
  )
}
