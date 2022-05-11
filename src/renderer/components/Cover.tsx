import SvgIcon from '@/renderer/components/SvgIcon'
import { player } from '@/renderer/store'
import {
  Mode,
  State,
  TrackListSource,
  TrackListSourceType,
} from '@/renderer/utils/player'
import { SyntheticEvent } from 'react'

const Cover = ({
  imageUrl,
  onClick,
  roundedClass = 'rounded-xl',
  showHover = true,
  alwaysShowShadow = false,
  coverInfo,
}: {
  imageUrl: string
  onClick?: () => void
  roundedClass?: string
  showHover?: boolean
  alwaysShowShadow?: boolean
  coverInfo?: TrackListSource
}) => {
  const [isError, setIsError] = useState(imageUrl.includes('3132508627578625'))
  const playerSnapshot = useSnapshot(player)
  const trackListSource = playerSnapshot.trackListSource
  const isThisCoverPlaying =
    playerSnapshot.mode === Mode.TrackList &&
    coverInfo &&
    coverInfo.type === trackListSource?.type &&
    coverInfo.id === trackListSource?.id
  const isPlaying =
    isThisCoverPlaying &&
    [State.Playing, State.Loading].includes(playerSnapshot.state)
  const handlePlay = (event: SyntheticEvent) => {
    event.stopPropagation()
    if (!coverInfo) return
    const { type, id } = coverInfo
    if (!id) {
      toast('无法播放歌单')
      return
    }
    if (isPlaying) {
      player.playOrPause()
      return
    }
    if (type === TrackListSourceType.Album) player.playAlbum(id)
    if (type === TrackListSourceType.Playlist) player.playPlaylist(id)
  }
  return (
    <div onClick={onClick} className='group relative z-0'>
      {/* Neon shadow */}
      {showHover && (
        <div
          className={classNames(
            'absolute top-2 z-[-1] h-full w-full scale-x-[.92] scale-y-[.96] bg-cover  blur-lg filter transition duration-300 ',
            roundedClass,
            !alwaysShowShadow && 'opacity-0 group-hover:opacity-60'
          )}
          style={{
            backgroundImage: `url("${imageUrl}")`,
          }}
        ></div>
      )}

      {/* Cover */}
      {isError ? (
        <div className='box-content flex aspect-square h-full w-full items-center justify-center rounded-xl border border-black border-opacity-5  bg-gray-800 text-gray-300 '>
          <SvgIcon name='music-note' className='h-1/2 w-1/2' />
        </div>
      ) : (
        <img
          className={classNames(
            'box-content aspect-square h-full w-full border border-black border-opacity-5 dark:border-white  dark:border-opacity-[.03]',
            roundedClass
          )}
          src={imageUrl}
          onError={() => imageUrl && setIsError(true)}
        />
      )}

      {/* Play button */}
      {coverInfo && (
        <div className='absolute top-0 hidden h-full w-full place-content-center group-hover:grid'>
          <button
            className='btn-pressed-animation grid h-11 w-11 cursor-default place-content-center rounded-full border border-white border-opacity-[.08] bg-white bg-opacity-[.14] text-white backdrop-blur backdrop-filter transition-all hover:bg-opacity-[.44]'
            onClick={handlePlay}
          >
            <SvgIcon
              className='ml-0.5 h-6 w-6'
              name={isPlaying ? 'pause' : 'play-fill'}
            />
          </button>
        </div>
      )}
    </div>
  )
}

export default Cover