export type SportKey =
  | 'football'
  | 'cricket'
  | 'basketball'
  | 'volleyball'
  | 'badminton'

export const SPORTS: { key: SportKey; label: string; emoji?: string }[] = [
  { key: 'football', label: 'Football' },
  { key: 'cricket', label: 'Cricket' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'volleyball', label: 'Volleyball' },
  { key: 'badminton', label: 'Badminton' },
]

export type Tournament = {
  id: string
  name: string
  sport: SportKey
  image: string
  date: string
  venue: string
  city: string
  prizePool: number
  entryFee: number
  teamsJoined: number
  totalSpots: number
  trending?: boolean
  featured?: boolean
  format: string
  startTimestamp: number
}

export const tournaments: Tournament[] = [
  {
    id: 't1',
    name: 'City Champions League',
    sport: 'football',
    image: '/images/tournament-banner.png',
    date: 'Sat, 21 Jun · 6:00 PM',
    venue: 'Greenfield Arena',
    city: 'Bengaluru',
    prizePool: 50000,
    entryFee: 1500,
    teamsJoined: 14,
    totalSpots: 16,
    trending: true,
    featured: true,
    format: '7v7 · Knockout',
    startTimestamp: Date.now() + 1000 * 60 * 60 * 52,
  },
  {
    id: 't2',
    name: 'Weekend Premier Cup',
    sport: 'football',
    image: '/images/turf-football-night.png',
    date: 'Sun, 22 Jun · 4:00 PM',
    venue: 'Turf Park Central',
    city: 'Bengaluru',
    prizePool: 25000,
    entryFee: 1000,
    teamsJoined: 8,
    totalSpots: 12,
    trending: true,
    format: '5v5 · League',
    startTimestamp: Date.now() + 1000 * 60 * 60 * 78,
  },
  {
    id: 't3',
    name: 'Hoops Showdown',
    sport: 'basketball',
    image: '/images/basketball-court.png',
    date: 'Fri, 27 Jun · 7:00 PM',
    venue: 'Downtown Court',
    city: 'Mumbai',
    prizePool: 30000,
    entryFee: 1200,
    teamsJoined: 6,
    totalSpots: 8,
    featured: true,
    format: '3v3 · Knockout',
    startTimestamp: Date.now() + 1000 * 60 * 60 * 120,
  },
  {
    id: 't4',
    name: 'Box Cricket Blast',
    sport: 'cricket',
    image: '/images/cricket-ground.png',
    date: 'Sat, 28 Jun · 5:00 PM',
    venue: 'Stadium Grounds',
    city: 'Pune',
    prizePool: 40000,
    entryFee: 2000,
    teamsJoined: 10,
    totalSpots: 16,
    format: 'T10 · League',
    startTimestamp: Date.now() + 1000 * 60 * 60 * 144,
  },
]

export type Turf = {
  id: string
  name: string
  image: string
  rating: number
  reviews: number
  distanceKm: number
  pricePerHour: number
  sports: SportKey[]
  slots: string[]
  area: string
}

export const turfs: Turf[] = [
  {
    id: 'tf1',
    name: 'Greenfield Arena',
    image: '/images/turf-football-night.png',
    rating: 4.9,
    reviews: 312,
    distanceKm: 1.2,
    pricePerHour: 1200,
    sports: ['football'],
    slots: ['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'],
    area: 'Koramangala',
  },
  {
    id: 'tf2',
    name: 'Downtown Court',
    image: '/images/basketball-court.png',
    rating: 4.7,
    reviews: 188,
    distanceKm: 2.8,
    pricePerHour: 900,
    sports: ['basketball', 'volleyball'],
    slots: ['5:00 PM', '6:00 PM', '8:00 PM'],
    area: 'Indiranagar',
  },
  {
    id: 'tf3',
    name: 'Turf Park Central',
    image: '/images/turf-arena-1.png',
    rating: 4.8,
    reviews: 256,
    distanceKm: 3.4,
    pricePerHour: 1100,
    sports: ['football', 'cricket'],
    slots: ['4:00 PM', '7:00 PM', '9:00 PM', '10:00 PM'],
    area: 'HSR Layout',
  },
  {
    id: 'tf4',
    name: 'Stadium Grounds',
    image: '/images/cricket-ground.png',
    rating: 4.6,
    reviews: 142,
    distanceKm: 5.1,
    pricePerHour: 1500,
    sports: ['cricket'],
    slots: ['3:00 PM', '5:00 PM', '8:00 PM'],
    area: 'Whitefield',
  },
]

export type PlayerRank = {
  id: string
  name: string
  avatar: string
  points: number
  matches: number
  change: number
  badge: string
}

export const playerRanks: PlayerRank[] = [
  { id: 'p1', name: 'Arjun Mehta', avatar: '/images/player-1.png', points: 2840, matches: 64, change: 2, badge: 'Striker' },
  { id: 'p2', name: 'Sara Khan', avatar: '/images/player-2.png', points: 2715, matches: 58, change: 0, badge: 'Playmaker' },
  { id: 'p3', name: 'Rohan Das', avatar: '/images/player-3.png', points: 2590, matches: 61, change: 1, badge: 'Defender' },
  { id: 'p4', name: 'Vikram Rao', avatar: '/images/player-1.png', points: 2410, matches: 52, change: -2, badge: 'Keeper' },
  { id: 'p5', name: 'Neha Iyer', avatar: '/images/player-2.png', points: 2300, matches: 49, change: 3, badge: 'Winger' },
  { id: 'p6', name: 'Karan Singh', avatar: '/images/player-3.png', points: 2180, matches: 47, change: -1, badge: 'Midfield' },
]

export type FeedPost = {
  id: string
  author: string
  avatar: string
  time: string
  type: 'Match Result' | 'Tournament Update' | 'Achievement' | 'Highlight Reel'
  content: string
  image?: string
  likes: number
  comments: number
}

export const feedPosts: FeedPost[] = [
  {
    id: 'f1',
    author: 'Arjun Mehta',
    avatar: '/images/player-1.png',
    time: '2h ago',
    type: 'Match Result',
    content: 'What a comeback! Thunder FC won 3-2 in the dying minutes. Hat-trick night for the books.',
    image: '/images/turf-football-night.png',
    likes: 248,
    comments: 36,
  },
  {
    id: 'f2',
    author: 'Sara Khan',
    avatar: '/images/player-2.png',
    time: '5h ago',
    type: 'Achievement',
    content: 'Just unlocked the "100 Assists" badge. Hard work pays off!',
    likes: 412,
    comments: 58,
  },
  {
    id: 'f3',
    author: 'City Champions League',
    avatar: '/images/player-3.png',
    time: '1d ago',
    type: 'Tournament Update',
    content: 'Quarterfinal fixtures are out! Check the bracket and get ready for the weekend showdown.',
    image: '/images/tournament-banner.png',
    likes: 156,
    comments: 22,
  },
]

export type NotificationItem = {
  id: string
  category: 'Matches' | 'Tournaments' | 'Bookings' | 'Community'
  title: string
  desc: string
  time: string
  unread: boolean
}

export const notifications: NotificationItem[] = [
  { id: 'n1', category: 'Matches', title: 'Match starting soon', desc: 'Thunder FC vs Strikers kicks off in 30 min', time: '5m', unread: true },
  { id: 'n2', category: 'Tournaments', title: 'You advanced!', desc: 'Your team qualified for the semifinals', time: '1h', unread: true },
  { id: 'n3', category: 'Bookings', title: 'Booking confirmed', desc: 'Greenfield Arena · Sat 8:00 PM', time: '3h', unread: false },
  { id: 'n4', category: 'Community', title: 'Sara liked your post', desc: 'Your match highlight got 200+ likes', time: '6h', unread: false },
  { id: 'n5', category: 'Matches', title: 'Result updated', desc: 'Final score posted for last night', time: '1d', unread: false },
]

export const teamRoster = [
  { id: 'r1', name: 'Arjun Mehta', avatar: '/images/player-1.png', position: 'ST', number: 9, captain: true },
  { id: 'r2', name: 'Sara Khan', avatar: '/images/player-2.png', position: 'CM', number: 8, captain: false },
  { id: 'r3', name: 'Rohan Das', avatar: '/images/player-3.png', position: 'CB', number: 4, captain: false },
  { id: 'r4', name: 'Vikram Rao', avatar: '/images/player-1.png', position: 'GK', number: 1, captain: false },
  { id: 'r5', name: 'Neha Iyer', avatar: '/images/player-2.png', position: 'LW', number: 11, captain: false },
  { id: 'r6', name: 'Karan Singh', avatar: '/images/player-3.png', position: 'RW', number: 7, captain: false },
]

export const matchEvents = [
  { minute: 12, type: 'Goal', team: 'home', player: 'A. Mehta' },
  { minute: 24, type: 'Yellow Card', team: 'away', player: 'M. Joseph' },
  { minute: 38, type: 'Goal', team: 'away', player: 'R. Pillai' },
  { minute: 56, type: 'Assist', team: 'home', player: 'S. Khan' },
  { minute: 67, type: 'Goal', team: 'home', player: 'A. Mehta' },
  { minute: 81, type: 'Red Card', team: 'away', player: 'D. Kumar' },
]

export function formatCurrency(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}
