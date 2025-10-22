import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface NavItem {
  id: string
  label: string
  path: string
  icon?: string
  isCenter?: boolean
}

const navItems: NavItem[] = [
  { id: 'task', label: '待办事项', path: '/task' },
  { id: 'store', label: '购物袋', path: '/store' },
  { id: 'base', label: '火箭', path: '/base', isCenter: true },
  { id: 'backpack', label: '包裹', path: '/backpack' },
  { id: 'home', label: '个人中心', path: '/home' },
]

// 使用现有SVG图标并添加霓虹光效
const TaskIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M15.5687 1.25H4.43132C3.0981 1.25 2 2.40893 2 3.81622V16.1838C2 17.5911 3.09809 18.75 4.4313 18.75H15.5687C16.9021 18.75 18 17.5911 18 16.1838L18 3.81622C18 2.40895 16.9806 1.25 15.5687 1.25ZM16.8236 16.2666C16.8236 17.0116 16.2747 17.591 15.5687 17.591H4.43134C3.72548 17.591 3.17645 17.0116 3.17645 16.2666L3.17645 3.81618C3.17645 3.07127 3.72548 2.49179 4.43134 2.49179H15.5687C16.2747 2.49179 16.8236 3.07125 16.8236 3.81618L16.8236 16.2666ZM7.87492 6.28841L6.14945 8.10952L5.36511 7.28187C5.12967 7.03351 4.7376 7.03351 4.58078 7.28187C4.34533 7.53007 4.34533 7.94407 4.58078 8.10952L5.83567 9.43407C5.91415 9.51681 6.07097 9.59954 6.30622 9.59954C6.54166 9.59954 6.54166 9.51681 6.77678 9.43407L8.89447 7.19897C9.12991 6.95061 9.12991 6.53678 8.89447 6.37115C8.42391 6.12294 8.11018 6.12294 7.87492 6.28841ZM15.0907 7.28187H9.67884C9.28677 7.28187 9.12981 7.53007 9.12981 7.86133C9.12981 8.27517 9.36525 8.4408 9.67884 8.4408H15.0908C15.4829 8.4408 15.6397 8.19243 15.6397 7.86133C15.6397 7.53007 15.4043 7.28187 15.0907 7.28187ZM6.46304 11.0068C5.44344 11.0068 4.6591 11.8346 4.6591 12.9108C4.6591 13.9868 5.44344 14.8147 6.46304 14.8147C7.48282 14.8147 8.26699 13.9868 8.26699 12.9108C8.26699 11.7519 7.40434 11.0068 6.46304 11.0068ZM6.46304 13.4903C6.07097 13.4903 5.83567 13.2419 5.83567 12.8281C5.83567 12.4141 6.07097 12.1657 6.46304 12.1657C6.85531 12.1657 7.09056 12.4141 7.09056 12.8281C7.09056 13.2419 6.77678 13.4903 6.46304 13.4903ZM15.0907 12.2484H9.67884C9.28677 12.2484 9.12981 12.4968 9.12981 12.8281C9.12981 13.159 9.36525 13.4075 9.67884 13.4075H15.0908C15.4829 13.4075 15.6397 13.1592 15.6397 12.8281C15.6397 12.4968 15.4043 12.2484 15.0907 12.2484Z" 
      fill={isActive ? "url(#taskNeonGradient)" : "#90A1B9"}
      stroke={isActive ? "url(#taskNeonGradient)" : "none"}
      strokeWidth={isActive ? "0.5" : "0"}
    />
    
    {/* 霓虹光效渐变定义 */}
    <defs>
      <linearGradient id="taskNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
)

const StoreIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.61116 18.957C2.72128 18.957 2 18.2256 2 17.3231V6.74462C2 5.84216 2.72128 5.1107 3.61116 5.1107H5.65322V4.89221C5.65322 2.46033 7.6016 1.04297 9.99962 1.04297C12.3976 1.04297 14.346 2.46033 14.346 4.89221V5.1107H16.3881C17.278 5.1107 17.9992 5.84216 17.9992 6.74462V17.3231C17.9992 18.2256 17.278 18.957 16.3881 18.957H3.61116ZM3.39572 17.5416H16.6129V6.52613H3.39572V17.5416ZM9.99962 2.4584C8.36972 2.4584 7.03957 3.24879 7.03957 4.90171V5.1202H12.9503V4.90171C12.9597 3.23929 11.6295 2.4584 9.99962 2.4584ZM9.99962 12.0739C7.67654 12.0739 5.775 10.2215 5.66259 7.89406H7.05831C7.17071 9.44249 8.44466 10.6679 9.99962 10.6679C11.5639 10.6679 12.8379 9.44249 12.9503 7.89406H14.346C14.2242 10.2215 12.3227 12.0739 9.99962 12.0739Z"
      fill={isActive ? "url(#storeNeonGradient)" : "#90A1B9"}
      stroke={isActive ? "url(#storeNeonGradient)" : "none"}
      strokeWidth={isActive ? "0.5" : "0"}
    />
    
    {/* 霓虹光效渐变定义 */}
    <defs>
      <linearGradient id="storeNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
)

const RocketIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="28" height="31" viewBox="0 0 28 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M22.9953 17.3636C22.5719 16.6484 22.5941 16.1896 20.0377 13.9663C20.052 5.92725 14.3145 0.35299 13.96 0.0161461C13.9599 0.00534735 13.9599 3.47956e-05 13.9599 3.47956e-05C13.9599 3.47956e-05 13.9562 0.00340285 13.9512 0.00819457L13.9427 0C13.9427 0 13.9428 0.00541681 13.9429 0.0162155C13.5897 0.354761 7.8785 5.95409 7.93046 13.9933C5.38439 16.2278 5.40885 16.6864 4.98897 17.4038C4.22204 18.7131 4.42107 23.9488 5.14411 25.1369C5.86714 26.3251 7.06574 25.4631 7.47646 25.1318C7.88722 24.8003 9.69988 22.6152 10.1461 22.7133C10.1461 22.7133 10.6947 22.6129 11.3132 23.1735C11.9246 23.7274 13.0382 24.2472 13.9912 24.3212C13.9912 24.3223 13.9912 24.3234 13.991 24.3243C13.9968 24.3236 14.0025 24.3232 14.0082 24.3226C14.0138 24.323 14.0199 24.3236 14.0255 24.324C14.0255 24.3233 14.0253 24.3222 14.0254 24.3212C14.9783 24.2431 16.0893 23.718 16.6979 23.1615C17.3139 22.5983 17.8632 22.6963 17.8632 22.6963C18.3086 22.5961 20.1318 24.7732 20.5438 25.103C20.9564 25.4325 22.1587 26.2891 22.8761 25.0979C23.5937 23.9061 23.7682 18.6697 22.9953 17.3636ZM13.9847 14.2772C12.3936 14.2806 11.1008 13.0406 11.0973 11.5075C11.0936 9.97407 12.3806 8.72836 13.9719 8.72503C15.5629 8.72135 16.8558 9.96136 16.8593 11.4946C16.8629 13.0279 15.5759 14.2735 13.9847 14.2772ZM16.1202 25.4108C15.3949 25.9371 14.6626 26.1139 13.9953 26.1064C13.3282 26.1165 12.5951 25.9432 11.8672 25.4202C11.2145 24.9722 10.6315 25.0333 10.3237 25.4237C10.0161 25.8139 10.1246 28.1817 10.5031 28.6905C10.8813 29.1991 11.3254 28.359 11.9769 28.3273C12.6286 28.2959 13.1701 29.5537 13.417 30.2726C13.5431 30.6401 13.7398 30.976 14.0065 31C14.2735 30.975 14.4687 30.6382 14.593 30.27C14.8368 29.5502 15.3725 28.2901 16.024 28.3185C16.6758 28.3474 17.1237 29.1854 17.4997 28.6749C17.8757 28.1645 17.973 25.7964 17.6635 25.4074C17.3541 25.0184 16.7708 24.9597 16.1202 25.4108Z" 
      fill="white"
    />
  </svg>
)

const BackpackIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.4991 5.09143C19.4991 4.68654 19.2549 4.32161 18.8807 4.1671L10.3812 0.658037C10.1368 0.557135 9.86234 0.557135 9.61793 0.658037L1.11839 4.1671C0.744146 4.32161 0.5 4.68654 0.5 5.09143V14.9331C0.5 15.3388 0.745166 15.7043 1.12057 15.8583L9.61999 19.3439C9.86319 19.4437 10.1359 19.4436 10.3791 19.3438L10.8199 19.1629H10.9936V19.0917L18.8784 15.8589C19.2539 15.705 19.4991 15.3394 19.4991 14.9337V5.09143ZM9.99954 7.76062L7.59209 6.7736L14.3551 3.76679C14.3707 3.7596 14.3809 3.74653 14.3958 3.73803L17.0937 4.85186L9.99954 7.76062ZM12.7286 3.04974L5.90728 6.08269L2.90542 4.8512L9.99954 1.92284L12.7286 3.04974ZM1.85708 5.84214L4.57123 6.95531V11.0165C4.57123 11.1898 4.64272 11.3561 4.76997 11.4787C4.89722 11.6012 5.06981 11.6701 5.24977 11.6701C5.42973 11.6701 5.60232 11.6012 5.72957 11.4787C5.85682 11.3561 5.92831 11.1898 5.92831 11.0165V7.51288L5.92967 7.51223L9.63653 9.03262V17.9302L1.85708 14.7397V5.84214ZM10.9936 17.6713V8.77378L18.142 5.84214V14.7403L10.9936 17.6713Z"
      fill={isActive ? "url(#backpackNeonGradient)" : "#90A1B9"}
      stroke={isActive ? "url(#backpackNeonGradient)" : "none"}
      strokeWidth={isActive ? "0.5" : "0"}
    />
    
    {/* 霓虹光效渐变定义 */}
    <defs>
      <linearGradient id="backpackNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
)

const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M1.50689 18.191C1.50219 18.2237 1.49989 18.2567 1.5 18.2898V18.3429C1.50556 18.4063 1.5191 18.4688 1.54034 18.5292C1.59203 18.6675 1.68771 18.7871 1.81421 18.8717C1.94071 18.9563 2.0918 19.0017 2.24666 19.0016C2.57228 19.0016 3.02185 18.7332 3.01004 18.3839C3.01004 14.729 6.12161 11.8697 9.9818 11.8697C10.028 11.8697 10.028 10.5449 9.9818 10.5449C5.41824 10.5384 1.69282 13.9054 1.50689 18.191ZM14.5385 13.4126C15.9895 14.6517 16.99 16.3612 16.99 18.3773C16.9782 18.7267 17.4277 18.995 17.7533 18.995C17.9082 18.9952 18.0593 18.9498 18.1858 18.8652C18.3123 18.7806 18.408 18.6609 18.4597 18.5227C18.4809 18.4623 18.4944 18.3998 18.5 18.3364V18.2833C18.5001 18.2502 18.4978 18.2172 18.4931 18.1845C18.4467 17.0724 18.1536 15.982 17.6329 14.9843C17.1123 13.9865 16.3757 13.1037 15.4711 12.3933C14.6998 11.8632 13.8144 12.7939 14.5385 13.4126Z" 
      fill={isActive ? "url(#homeNeonGradient)" : "#90A1B9"}
      stroke={isActive ? "url(#homeNeonGradient)" : "none"}
      strokeWidth={isActive ? "0.5" : "0"}
    />
    <path 
      d="M9.99012 0.998047C8.85483 0.998047 7.74504 1.31687 6.80108 1.91421C5.85712 2.51155 5.1214 3.36057 4.68694 4.35391C4.25249 5.34724 4.13881 6.44028 4.3603 7.4948C4.58178 8.54932 5.12847 9.51796 5.93124 10.2782C6.73401 11.0385 7.7568 11.5562 8.87028 11.766C9.98375 11.9758 11.1379 11.8681 12.1868 11.4566C13.2356 11.0452 14.1321 10.3484 14.7629 9.45444C15.3936 8.56046 15.7302 7.50943 15.7302 6.43425C15.7302 4.99248 15.1255 3.60976 14.049 2.59027C12.9725 1.57079 11.5125 0.998047 9.99012 0.998047ZM9.99012 10.5121C9.1387 10.5121 8.30641 10.273 7.59848 9.82502C6.89055 9.37704 6.33879 8.74031 6.01296 7.99535C5.68714 7.25039 5.60189 6.43066 5.76799 5.63981C5.9341 4.84897 6.34409 4.12253 6.94614 3.55236C7.54818 2.9822 8.31523 2.59391 9.15029 2.4366C9.98534 2.27929 10.8509 2.36003 11.6375 2.6686C12.4241 2.97717 13.0964 3.49972 13.5695 4.17017C14.0425 4.84061 14.295 5.62884 14.295 6.43518C14.295 7.51645 13.8414 8.55343 13.0341 9.318C12.2268 10.0826 11.1318 10.5121 9.99012 10.5121Z" 
      fill={isActive ? "url(#homeNeonGradient)" : "#90A1B9"}
      stroke={isActive ? "url(#homeNeonGradient)" : "none"}
      strokeWidth={isActive ? "0.5" : "0"}
    />
    
    {/* 霓虹光效渐变定义 */}
    <defs>
      <linearGradient id="homeNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="50%" stopColor="#EC4899" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
)

export default function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const renderIcon = (item: NavItem, isActive: boolean) => {
    switch (item.id) {
      case 'task':
        return <TaskIcon isActive={isActive} />
      case 'store':
        return <StoreIcon isActive={isActive} />
      case 'base':
        return <RocketIcon isActive={isActive} />
      case 'backpack':
        return <BackpackIcon isActive={isActive} />
      case 'home':
        return <HomeIcon isActive={isActive} />
      default:
        return null
    }
  }

  return (
    <div 
      className="w-full h-[60px] flex items-center px-6 relative"
    >
      {/* SVG 背景 */}
      <svg 
        className="absolute inset-0 w-full h-full z-0" 
        viewBox="0 0 393 60" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <foreignObject x="-4" y="-4" width="401" height="68">
          <div 
            xmlns="http://www.w3.org/1999/xhtml" 
            style={{
              backdropFilter: 'blur(2px)',
              clipPath: 'url(#bgblur_0_2824_15_clip_path)',
              height: '100%',
              width: '100%'
            }}
          />
        </foreignObject>
        <path 
          data-figma-bg-blur-radius="4" 
          d="M155.386 0C160.414 0.000211198 164 4.97163 164 10C164 28.2254 178.775 43 197 43C215.225 43 230 28.2254 230 10C230 4.97163 233.586 0.000221256 238.614 0H385C389.418 0 393 3.58172 393 8V52C393 56.4183 389.418 60 385 60H8C3.58172 60 0 56.4183 0 52V8C0 3.58172 3.58172 0 8 0H155.386Z" 
          fill="url(#paint0_linear_2824_15)" 
          fillOpacity="0.8"
        /> 
        <defs> 
          <clipPath id="bgblur_0_2824_15_clip_path" transform="translate(4 4)">
            <path d="M155.386 0C160.414 0.000211198 164 4.97163 164 10C164 28.2254 178.775 43 197 43C215.225 43 230 28.2254 230 10C230 4.97163 233.586 0.000221256 238.614 0H385C389.418 0 393 3.58172 393 8V52C393 56.4183 389.418 60 385 60H8C3.58172 60 0 56.4183 0 52V8C0 3.58172 3.58172 0 8 0H155.386Z"/> 
          </clipPath>
          <linearGradient id="paint0_linear_2824_15" x1="384.79" y1="50" x2="94.2339" y2="-139.69" gradientUnits="userSpaceOnUse"> 
            <stop stopColor="#182253"/> 
            <stop offset="1" stopColor="#2B1753"/> 
          </linearGradient> 
        </defs> 
      </svg>
      <div className="flex items-center justify-between h-full w-full relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path === '/base' && pathname === '/')
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`relative flex items-center justify-center transition-all duration-300 ${
                item.isCenter 
                  ? 'w-[49px] h-[49px] rounded-full -translate-y-5' 
                  : 'w-12 h-12'
              }`}
              style={item.isCenter ? {
                background: 'linear-gradient(275.69deg, #182253 3.41%, #2B1753 99.3%)'
              } : {}}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              {/* 图标容器 */}
              <div className={`flex items-center justify-center ${
                item.isCenter ? 'w-8 h-8' : 'w-6 h-6'
              }`}>
                {renderIcon(item, isActive)}
              </div>
              
              {/* 中心火箭图标的蓝色光晕效果 */}
              {item.isCenter && (
                <>
                  {/* 底部蓝色光晕渐变 */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-8 rounded-full opacity-60"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.6) 0%, rgba(29, 78, 216, 0.4) 50%, transparent 100%)',
                      filter: 'blur(8px)'
                    }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  {/* 圆形容器的呼吸效果 */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-slate-500/30 "
                    animate={{ 
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.4)',
                        '0 0 0 8px rgba(59, 130, 246, 0.1)',
                        '0 0 0 0 rgba(59, 130, 246, 0.4)'
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}