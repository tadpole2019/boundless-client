import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/user/use-auth'
import Navbar from '@/components/common/navbar'
import NavbarMb from '@/components/common/navbar-mb'
import Footer from '@/components/common/footer'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { debounce } from 'lodash'
// sweetalert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
//data
import CityCountyData from '@/data/CityCountyData.json'
import playerData from '@/data/player.json'
import genreData from '@/data/genre.json'
// icons
import { IoHome } from 'react-icons/io5'
import { FaChevronRight } from 'react-icons/fa6'
import { ImExit } from 'react-icons/im'
import { FaCirclePlus } from 'react-icons/fa6'
// scss
import styles from '@/pages/jam/jam.module.scss'

const mySwal = withReactContent(Swal)

export default function Form() {
  const router = useRouter()
  //從hook 獲得使用者登入的資訊  儲存在變數LoginUserData裡面
  const { LoginUserData, handleLoginStatus, getLoginUserData, handleLogout } =
    useAuth()
  // console.log(LoginUserData)
  //檢查token
  useEffect(() => {
    handleLoginStatus()
    //獲得資料
    getLoginUserData()
  }, [])
  // ---------------------- 手機版本  ----------------------
  // 主選單
  const [showMenu, setShowMenu] = useState(false)
  const menuMbToggle = () => {
    setShowMenu(!showMenu)
  }
  // ---------------------- 標題 ----------------------
  const [title, setTitle] = useState('')
  const [titleCheck, setTitleCheck] = useState(true)
  // ---------------------- 技術程度
  const [degree, setDegree] = useState('')

  // ---------------------- 曲風 ----------------------
  // 儲存選擇的曲風
  const [genre, setgenre] = useState([])
  const [genreCheck, setGenreCheck] = useState(true)
  // 變更曲風下拉選單的數量時，陣列會多一個元素
  const [genreSelect, setgenreSelect] = useState([1])
  // 實際使用的曲風陣列，避免使用者未照順序新增樂手
  const [finalgenre, setFinalgenre] = useState('')

  // ---------------------- 擔任職位 ----------------------
  // 控制表單狀態
  const [myPlayer, setMyPlayer] = useState('')
  // 表單實際送出的內容
  const [finalMyPlayer, setFinalMyPlayer] = useState('')
  // console.log(finalMyPlayers)

  // ---------------------- 徵求樂手 ----------------------
  const [players, setplayers] = useState([])
  const [playersSelect, setPlayersSelect] = useState([1])
  // 實際使用的樂手陣列，避免使用者未照順序新增樂手
  const [finalPlayers, setFinalPlayers] = useState([])

  // ---------------------- 篩選城市用的資料 ----------------------
  const cityData = CityCountyData.map((v, i) => {
    return v.CityName
  }).filter((v) => {
    return v !== '釣魚臺' && v !== '南海島'
  })
  const [region, setRegion] = useState('')

  // ---------------------- 其他條件 ----------------------
  const [condition, setCondition] = useState('')
  const [conditionCheck, setConditionCheck] = useState(true)
  // ---------------------- 描述 ----------------------
  const [description, setDescription] = useState('')
  const [descriptionCheck, setDescriptionCheck] = useState(true)

  // ---------------------- 表單填寫 ----------------------
  // 表單完成狀態 0: 有欄位尚未填寫或不符規定, 1: 填寫完成, 2: 填寫中
  const [complete, setComplete] = useState(2)
  // 檢查不雅字詞
  const checkBadWords = debounce(() => {
    const badWords = /幹|屎|尿|屁|糞|靠北|靠腰|雞掰|王八|你媽|妳媽|淫/g
    setTitleCheck(title.search(badWords) < 0 ? true : false)
    setConditionCheck(condition.search(badWords) < 0 ? true : false)
    setDescriptionCheck(description.search(badWords) < 0 ? true : false)
  }, 250)
  // 檢查是否重複填寫曲風
  const checkGenre = debounce(() => {
    const genreSet = new Set(genre) // 建立 set 物件，該物件中的每個屬性都是唯一值
    // 若長度不同，則代表陣列中有重複的值
    if (genre.length !== genreSet.size) {
      setGenreCheck(false)
    } else {
      setGenreCheck(true)
    }
  }, 250)
  // 檢查表單是否填妥
  const checkComplete = () => {
    if (titleCheck === false || title === '') {
      setComplete(0)
      return false
    }
    if (degree === '') {
      setComplete(0)
      return false
    }
    if (genreCheck === false || finalgenre === '' || finalgenre === '[]') {
      setComplete(0)
      return false
    }
    if (myPlayer === '') {
      setComplete(0)
      return false
    }
    if (finalPlayers === '' || finalPlayers === '[]') {
      setComplete(0)
      return false
    }
    if (region === '') {
      setComplete(0)
      return false
    }
    if (conditionCheck === false) {
      setComplete(0)
      return false
    }
    if (descriptionCheck === false || description === '') {
      setComplete(0)
      return false
    }
    setComplete(1)
    return true
  }
  const sendForm = async (
    uid,
    title,
    degree,
    finalgenre,
    finalMyPlayer,
    finalPlayers,
    region,
    condition,
    description
  ) => {
    if (!checkComplete()) {
      return false
    }
    let formData = new FormData()
    formData.append('uid', uid)
    formData.append('title', title)
    formData.append('degree', degree)
    formData.append('genre', finalgenre)
    formData.append('former', finalMyPlayer)
    formData.append('players', finalPlayers)
    formData.append('region', region)
    formData.append('condition', condition)
    formData.append('description', description)
    // 確認formData內容
    // for (let [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`)
    // }
    const res = await fetch('http://localhost:3005/api/jam/form', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    const result = await res.json()
    if (result.status === 'success') {
      notifySuccess(result.juid)
    } else {
      console.log(result.error)
    }
  }
  // 發起成功後，彈出訊息框，並跳轉到資訊頁面
  const notifySuccess = (juid) => {
    mySwal
      .fire({
        position: 'center',
        icon: 'success',
        iconColor: '#1581cc',
        title: '發起成功，將為您跳轉到資訊頁',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(
        setTimeout(() => {
          router.push(`/jam/recruit-list/${juid}`)
        }, 3000)
      )
  }
  // ---------------------- 偵測表單輸入變化，並執行檢查
  useEffect(() => {
    // 跳出未填寫完畢警告後再次輸入，消除警告
    setComplete(2)
    // 檢查不雅字詞
    checkBadWords.cancel() // 取消上一次的延遲
    checkBadWords()
    // 檢查無重複的曲風
    checkGenre.cancel()
    checkGenre()
    // 把曲風&徵求樂手轉換成表單實際接收的字串格式
    const fgArr = genre.filter((v) => v != (null || undefined))
    setFinalgenre(`[${fgArr.toString()}]`)
    const fpArr = players.filter((v) => v != (null || undefined))
    setFinalPlayers(`[${fpArr.toString()}]`)
    // 檢查表單是否完成
  }, [title, degree, genre, myPlayer, players, region, condition, description])
  return (
    <>
      <Head>
        <title>發起JAM</title>
      </Head>
      <Navbar menuMbToggle={menuMbToggle} />
      <div
        className="container position-relative"
        style={{ minHeight: '95svh' }}
      >
        {/* 手機版主選單/navbar */}
        <div
          className={`menu-mb d-sm-none d-flex flex-column align-items-center ${
            showMenu ? 'menu-mb-show' : ''
          }`}
        >
          <NavbarMb/>
        </div>
        <div className={`${styles.row} row`}>
          {/* 麵包屑 */}
          <div className="breadcrumb-wrapper-ns">
            <ul className="d-flex align-items-center p-0 m-0">
              <IoHome size={20} />
              <li style={{ marginLeft: '8px' }}>Let&apos;s JAM!</li>
              <FaChevronRight />
              <Link href="/jam/recruit-list">
                <li style={{ marginLeft: '10px' }}>團員募集</li>
              </Link>

              <FaChevronRight />
              <li style={{ marginLeft: '10px' }}>發起JAM</li>
            </ul>
          </div>
          <section className="col-12 col-sm-8" style={{ padding: 0 }}>
            {/* 主內容 */}
            <div className={`${styles.jamLeft}`}>
              <div className="row align-items-center">
                <div className={`${styles.jamTitle} col-12 col-sm-2`}>
                  發起表單
                </div>
                <div
                  className="col-12 col-sm-10 mt-sm-0"
                  style={{ color: '#666666' }}
                >
                  ※ 點擊&nbsp;
                  <FaCirclePlus
                    size={18}
                    style={{ color: '#18a1ff' }}
                    className="mb-1"
                  />
                  &nbsp;可增加項目
                </div>
              </div>

              {/* -------------------------- 主旨 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label
                  className={`${styles.itemTitle} col-12 col-sm-2`}
                  htmlFor="title"
                >
                  主旨
                </label>
                <div
                  className={`${styles.itemInputWrapper} col-12 col-sm-10 d-flex align-items-center`}
                >
                  <input
                    type="text"
                    className={`${styles.itemInput} form-control`}
                    name="title"
                    id="title"
                    placeholder="發起動機或目的，上限20字"
                    maxLength={20}
                    onChange={(e) => {
                      setTitle(e.target.value)
                    }}
                  />
                  {titleCheck ? (
                    ''
                  ) : (
                    <div
                      className={`${styles.warningText} ms-2 d-none d-sm-block`}
                    >
                      偵測到不雅字詞
                    </div>
                  )}
                </div>
                {titleCheck ? (
                  ''
                ) : (
                  <div
                    className={`${styles.warningText} d-block d-sm-none p-0`}
                  >
                    偵測到不雅字詞
                  </div>
                )}
              </div>
              {/* -------------------------- 技術程度 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label
                  className={`${styles.itemTitle} col-12 col-sm-2`}
                  htmlFor="degree"
                >
                  技術程度
                </label>
                <div className={`${styles.itemInputWrapper} col-12 col-sm-10`}>
                  <select
                    defaultValue={''}
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={degree}
                    name="degree"
                    id="degree"
                    onChange={(e) => {
                      setDegree(e.target.value)
                    }}
                  >
                    <option value="" disabled>
                      請選擇
                    </option>
                    <option value="1">新手練功</option>
                    <option value="2">老手同樂</option>
                  </select>
                </div>
              </div>
              {/* -------------------------- 音樂風格 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label
                  className={`${styles.itemTitle} col-12 col-sm-2`}
                  htmlFor="genre"
                >
                  音樂風格
                </label>
                <div className={`${styles.itemInputWrapper} col-12 col-sm-10`}>
                  <div className={`${styles.selectGroup}`}>
                    {genreSelect.map((v, i) => {
                      return (
                        <select
                          defaultValue={''}
                          key={i}
                          className="form-select"
                          style={{ width: 'auto' }}
                          value={genre[i]}
                          name="genre"
                          id="genre"
                          onChange={(e) => {
                            let newgenre = [...genre]
                            newgenre[i] = e.target.value
                            setgenre(newgenre)
                          }}
                        >
                          <option value="" disabled>
                            請選擇
                          </option>
                          {genreData.map((v) => {
                            return (
                              <option key={v.id} value={v.id}>
                                {v.name}
                              </option>
                            )
                          })}
                        </select>
                      )
                    })}
                    {genreSelect.length < 3 ? (
                      <div className={`${styles.plusBtnWrapper}`}>
                        <FaCirclePlus
                          size={24}
                          className={`${styles.plusBtn}`}
                          onClick={() => {
                            const newArr = [...genreSelect, 1]
                            setgenreSelect(newArr)
                          }}
                        />
                        <span className="mb-1" style={{ color: '#1d1d1d' }}>
                          (剩餘 {3 - genreSelect.length})
                        </span>
                      </div>
                    ) : (
                      ''
                    )}
                    {genreCheck ? (
                      ''
                    ) : (
                      <div
                        className={`${styles.warningText} d-none d-sm-block`}
                        style={{ marginTop: '5px' }}
                      >
                        無法選擇重複曲風
                      </div>
                    )}
                  </div>
                  {genreCheck ? (
                    ''
                  ) : (
                    <div
                      className={`${styles.warningText} d-block d-sm-none mt-2 p-0`}
                    >
                      無法選擇重複曲風
                    </div>
                  )}
                </div>
              </div>
              {/* -------------------------- 擔任職位 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label className={`${styles.itemTitle} col-12 col-sm-2`} htmlFor='myPlayer'>
                  擔任職位
                </label>
                <div className={`${styles.itemInputWrapper} col-12 col-sm-10`}>
                  <select
                    defaultValue={''}
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={myPlayer}
                    name="myPlayer"
                    id='myPlayer'
                    onChange={(e) => {
                      setMyPlayer(e.target.value)
                      setFinalMyPlayer(
                        `{"id": ${LoginUserData.id}, "play": ${e.target.value}}`
                      )
                    }}
                  >
                    <option value="" disabled>
                      請選擇
                    </option>
                    {playerData.map((v) => {
                      return (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              {/* -------------------------- 徵求樂手 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label className={`${styles.itemTitle} col-12 col-sm-2`} htmlFor='players'>
                  徵求樂手
                </label>
                <div className={`${styles.itemInputWrapper} col-12 col-sm-10`}>
                  <div className={`${styles.selectGroup}`}>
                    {playersSelect.map((v, i) => {
                      return (
                        <select
                          defaultValue={''}
                          key={i}
                          className="form-select"
                          style={{ width: 'auto' }}
                          value={players[i]}
                          name="players"
                          id='players'
                          onChange={(e) => {
                            let newplayer = [...players]
                            newplayer[i] = e.target.value
                            setplayers(newplayer)
                          }}
                        >
                          <option value="" disabled>
                            請選擇
                          </option>
                          {playerData.map((v) => {
                            return (
                              <option key={v.id} value={v.id}>
                                {v.name}
                              </option>
                            )
                          })}
                        </select>
                      )
                    })}
                    {playersSelect.length < 6 ? (
                      <div className={`${styles.plusBtnWrapper}`}>
                        <FaCirclePlus
                          size={24}
                          className={`${styles.plusBtn}`}
                          onClick={() => {
                            const newArr = [...playersSelect, 1]
                            setPlayersSelect(newArr)
                          }}
                        />
                        <span style={{ color: '#1d1d1d' }}>
                          (剩餘 {6 - playersSelect.length})
                        </span>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
              {/* -------------------------- 地區 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label className={`${styles.itemTitle} col-12 col-sm-2`} htmlFor='region'>
                  地區
                </label>
                <div className={`${styles.itemInputWrapper} col-12 col-sm-10`}>
                  <select
                    defaultValue={''}
                    className="form-select"
                    style={{ width: 'auto' }}
                    value={region}
                    name="region"
                    id='region'
                    onChange={(e) => {
                      setRegion(e.target.value)
                    }}
                  >
                    <option value="" disabled>
                      請選擇
                    </option>
                    {cityData.map((v, i) => {
                      return (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              {/* -------------------------- 其他條件 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label className={`${styles.itemTitle} col-12 col-sm-2`} htmlFor='condition'>
                  其他條件(選填)
                </label>
                <div className={`${styles.itemInputWrapper} col-12 col-sm-10`}>
                  <input
                    type="text"
                    className={`form-control`}
                    name='condition'
                    id='condition'
                    placeholder="事先說好要求，有助於玩團和樂哦～上限30字"
                    maxLength={30}
                    onChange={(e) => {
                      setCondition(e.target.value)
                    }}
                  />
                  {conditionCheck ? (
                    ''
                  ) : (
                    <div
                      className={`${styles.warningText} mt-1 d-none d-sm-block`}
                    >
                      偵測到不雅字詞
                    </div>
                  )}
                </div>
                {conditionCheck ? (
                  ''
                ) : (
                  <div
                    className={`${styles.warningText} d-block d-sm-none p-0`}
                  >
                    偵測到不雅字詞
                  </div>
                )}
              </div>
              {/* -------------------------- 描述 -------------------------- */}
              <div className={`${styles.formItem} row`}>
                <label className={`${styles.itemTitle} col-12 col-sm-2`} htmlFor='description'>
                  描述
                </label>
                <div className={`${styles.itemInputWrapper} col-12 col-sm-10`}>
                  <textarea
                    className={`${styles.textArea} form-control`}
                    placeholder="輸入清楚、吸引人的描述，讓大家瞭解你的成團動機吧！上限150字"
                    name="description"
                    id='description'
                    maxLength={150}
                    onChange={(e) => {
                      setDescription(e.target.value)
                    }}
                  />
                  {descriptionCheck ? (
                    ''
                  ) : (
                    <div
                      className={`${styles.warningText} mt-1 d-none d-sm-block`}
                    >
                      偵測到不雅字詞
                    </div>
                  )}
                </div>
                {descriptionCheck ? (
                  ''
                ) : (
                  <div
                    className={`${styles.warningText} d-block d-sm-none p-0`}
                  >
                    偵測到不雅字詞
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-center">
                <div
                  className="b-btn b-btn-primary"
                  style={{ paddingInline: '38px' }}
                  role="presentation"
                  onClick={() => {
                    sendForm(
                      LoginUserData.uid,
                      title,
                      degree,
                      finalgenre,
                      finalMyPlayer,
                      finalPlayers,
                      region,
                      condition,
                      description
                    )
                  }}
                >
                  提交
                </div>
              </div>
              {complete === 0 ? (
                <div
                  className="d-flex justify-content-center"
                  style={{ marginTop: '-8px' }}
                >
                  <div className={`${styles.warningText}`}>
                    請遵照規則，並填寫所有必填內容
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </section>

          {/*   ---------------------- 發起須知  ---------------------- */}
          <section className={`${styles.jamRightWrapper} col-12 col-sm-4`}>
            <div className={`${styles.jamRight}`}>
              <div className={`${styles.jamTitle}`}>發起須知</div>
              <ol className={`${styles.rules}`}>
                <li>社群互動，請注意禮節。</li>
                <li>
                  發起的 JAM{' '}
                  <span className={`${styles.point}`}>以一個為限</span>
                  ，發起後即視為有所屬，<span className={`${styles.point}`}>不得</span>
                  申請他人的 JAM。
                </li>
                <li>
                  除<span className={`${styles.point}`}>其他條件</span>
                  以外，所有內容皆為
                  <span className={`${styles.point}`}>必填</span>。
                </li>
                <li>
                  為避免頻繁改變樂團方向，造成和參與者間的協調糾紛，發起後
                  <span className={`${styles.point}`}>
                    僅能修改標題、其他條件及描述內容
                  </span>
                  ，請送出前再三確認。
                </li>
                <li>
                  發起後，若 <span className={`${styles.point}`}>30 天內</span>
                  無法成團，視為發起失敗，將解散 JAM。
                </li>
                <li>發起人得視招募情況解散或以當下成員成團。</li>
              </ol>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
