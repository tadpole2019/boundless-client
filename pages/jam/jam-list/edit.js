import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { debounce } from 'lodash'
import { useAuth } from '@/hooks/user/use-auth'
import { useJam } from '@/hooks/use-jam'
import Navbar from '@/components/common/navbar'
import NavbarMb from '@/components/common/navbar-mb'
import Footer from '@/components/common/footer'
import MemberInfo from '@/components/jam/member-info'
import logoMb from '@/assets/logo_mb.svg'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import 'animate.css'
// icons
import { IoHome } from 'react-icons/io5'
import { FaChevronRight } from 'react-icons/fa6'
import { ImExit } from 'react-icons/im'
import { FaCamera } from 'react-icons/fa6'
// scss
import styles from '@/pages/jam/jam.module.scss'

export default function Edit() {
  const router = useRouter()
  const { setInvalidEdit } = useJam()
  // ----------------------會員登入狀態 & 會員資料獲取  ----------------------
  //從hook 獲得使用者登入的資訊  儲存在變數LoginUserData裡面
  const { LoginUserData, handleLoginStatus, getLoginUserData, handleLogout } =
    useAuth()
  // console.log(LoginUserData)
  //檢查token
  useEffect(() => {
    handleLoginStatus()
    //獲得資料
    getLoginUserData()
    if (!LoginUserData.my_jam) {
      setInvalidEdit(false)
      router.push('/jam/jam-list')
      return
    }
  }, [])
  //登出功能
  const mySwal = withReactContent(Swal)

  const [genre, setGenre] = useState([])
  const [jam, setJam] = useState({
    id: 0,
    juid: '',
    name: '',
    formed_time: '',
    genre: [],
    region: '',
    introduce: '',
    cover_img: '',
    works_link: '',
    former: {},
    member: [],
  })
  // ---------------------- 手機版本  ----------------------
  // 主選單
  const [showMenu, setShowMenu] = useState(false)
  const menuMbToggle = () => {
    setShowMenu(!showMenu)
  }
  // ----------------------------- genre對應 -----------------------------
  const genreName = jam.genre.map((g) => {
    const matchedgenre = genre.find((gd) => gd.id === g)
    return matchedgenre.name
  })
  // ----------------------------- 創立時間資料中，單獨取出日期 -----------------------------
  // 調出的時間是ISO格式，顯示時需要轉換成本地時區
  const formedDate = new Date(jam.formed_time)
    .toLocaleString()
    .split(' ')[0]
    .replace(/\//g, '-')
  // ----------------------------- 修改資訊表單 -----------------------------
  const [complete, setComplete] = useState(2)
  // ---------------------- 團名 ----------------------
  const [bandName, setBandName] = useState('')
  const [bandNameCheck, setBandNameCheck] = useState(true)
  // ---------------------- 介紹 ----------------------
  const [introduce, setIntroduce] = useState('')
  const [introduceCheck, setIntroduceCheck] = useState(true)
  // ---------------------- 展示牆網址 ----------------------
  const [yturl, setYturl] = useState('')
  // ---------------------- 上傳封面圖&預覽 ----------------------
  // 選擇的檔案
  const [selectedFile, setSelectedFile] = useState(null)
  // 預覽URL
  const [preview, setPreview] = useState('')
  const handleFileChange = (e) => {
    // 檔案存在於FileList
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }
  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }
    const url = URL.createObjectURL(selectedFile)
    // console.log(url)
    setPreview(url)

    // 掛載時清除記憶體
    return () => URL.revokeObjectURL(url)
  }, [selectedFile])

  // 檢查不雅字詞
  const checkBadWords = debounce(() => {
    const badWords = /幹|屎|尿|屁|糞|靠北|靠腰|雞掰|王八|你媽|妳媽|淫/g
    setBandNameCheck(bandName.search(badWords) < 0 ? true : false)
    setIntroduceCheck(introduce.search(badWords) < 0 ? true : false)
  }, 250)

  // 檢查表單是否填妥
  const checkComplete = () => {
    if (bandNameCheck === false || bandName === '') {
      setComplete(0)
      return false
    }
    setComplete(1)
    return true
  }

  // 送出更改
  const sendForm = async (juid, bandName, introduce, selectedFile, yturl) => {
    if (!checkComplete()) {
      return false
    }
    let formData = new FormData()
    formData.append('juid', juid)
    formData.append('bandName', bandName)
    formData.append('introduce', introduce)
    formData.append('cover_img', selectedFile)
    formData.append('works_link', yturl)
    const res = await fetch('http://localhost:3005/api/jam/editInfo', {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })
    const result = await res.json()
    if (result.status === 'success') {
      notifySuccess(juid)
    } else {
      console.log(result.error)
    }
  }
  // 修改成功後，彈出訊息框，並返回資訊頁面
  const notifySuccess = (juid) => {
    mySwal
      .fire({
        position: 'center',
        icon: 'success',
        iconColor: '#1581cc',
        title: '修改成功，返回資訊頁',
        showConfirmButton: false,
        timer: 3000,
      })
      .then(
        setTimeout(() => {
          router.push(`/jam/jam-list/${juid}`)
        }, 3000)
      )
  }

  // 向伺服器要求資料，設定到狀態中用的函式
  const getSingleData = async (juid) => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/jam/singleFormedJam/${juid}`
      )
      // res.json()是解析res的body的json格式資料，得到JS的資料格式
      const data = await res.json()
      if (data.status === 'success') {
        setGenre(data.genreData)
        setJam(data.jamData)
      } else if (data.status === 'error') {
        setInvalidJam(false)
        router.push(`/jam/jam-list`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ----------------------------- useEffect -----------------------------
  // 初次渲染後，向伺服器要求資料，設定到狀態中
  useEffect(() => {
    if (LoginUserData.my_jam) {
      getSingleData(LoginUserData.my_jam)
    }
  }, [LoginUserData.my_jam])

  useEffect(() => {
    setBandName(jam.name)
    if (jam.introduce === null) {
      setIntroduce('')
    } else {
      setIntroduce(jam.introduce)
    }
    if (jam.works_link === null) {
      setYturl('')
    } else {
      setYturl(jam.works_link)
    }
  }, [jam.name, jam.introduce, jam.works_link])

  // 表單檢查
  useEffect(() => {
    // 跳出未填寫完畢警告後再次輸入，消除警告
    setComplete(2)
    // 檢查不雅字詞
    checkBadWords.cancel() // 取消上一次的延遲
    checkBadWords()
  }, [bandName, introduce])

  return (
    <>
      <Head>
        <title>編輯資訊</title>
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
              <Link href="/jam/jam-list">
                <li style={{ marginLeft: '10px' }}>活動中的JAM</li>
              </Link>

              <FaChevronRight />
              <li style={{ marginLeft: '10px' }}>JAM資訊</li>
            </ul>
          </div>
          {/*   ---------------------- 主要內容  ---------------------- */}
          <div className={`${styles.jamMain} col-12 col-sm-8`}>
            <div className={`${styles.jamLeft}`}>
              {/*   ---------------------- 樂團資訊  ---------------------- */}
              <section className={`${styles.jamLeftSection} position-relative`}>
                <div
                  className={`${styles.jamTitle} d-flex justify-content-start align-items-center`}
                >
                  <div>編輯資訊</div>
                </div>
                {/* -------------------------- 封面圖 -------------------------- */}
                <label
                  className={`${styles.coverWrapper}`}
                  style={{ cursor: 'pointer' }}
                  htmlFor="cover_img"
                >
                  <input
                    type="file"
                    name="cover_img"
                    id="cover_img"
                    accept="image/*"
                    hidden
                    onChange={handleFileChange}
                  />
                  {preview ? (
                    <Image
                      src={preview}
                      fill
                      style={{ objectFit: 'cover' }}
                      alt={jam.cover_img}
                    />
                  ) : (
                    <>
                      {jam.cover_img ? (
                        <Image
                          src={`http://localhost:3005/jam/${jam.cover_img}`}
                          fill
                          style={{ objectFit: 'cover' }}
                          alt={jam.cover_img}
                        />
                      ) : (
                        <div className={`${styles.noCoverBackground}`}>
                          <Image src={logoMb} alt="logo-mobile" />
                        </div>
                      )}
                    </>
                  )}
                </label>
                <div className={`${styles.cameraIcon}`}>
                  <FaCamera />
                </div>
                {/* -------------------------- 團名 -------------------------- */}
                <div className={`${styles.formItem} row`}>
                  <label
                    className={`${styles.itemTitle} col-12 col-sm-2`}
                    htmlFor="bandName"
                  >
                    團名*
                  </label>
                  <div
                    className={`${styles.itemInputWrapper} col-12 col-sm-10 d-flex align-items-center`}
                  >
                    <input
                      type="text"
                      className={`${styles.itemInput} form-control`}
                      name="bandName"
                      id="bandName"
                      placeholder="可中英文混合，上限30字"
                      maxLength={30}
                      value={bandName}
                      onChange={(e) => {
                        setBandName(e.target.value)
                      }}
                    />
                    {bandNameCheck ? (
                      ''
                    ) : (
                      <div
                        className={`${styles.warningText} ms-2 d-none d-sm-block`}
                      >
                        偵測到不雅字詞
                      </div>
                    )}
                  </div>
                  {bandNameCheck ? (
                    ''
                  ) : (
                    <div
                      className={`${styles.warningText} d-block d-sm-none p-0`}
                    >
                      偵測到不雅字詞
                    </div>
                  )}
                </div>
                {/* -------------------------- 音樂風格 -------------------------- */}
                <div className={`${styles.formItem} row`}>
                  <div className={`${styles.itemTitle} col-12 col-sm-2`}>
                    音樂風格
                  </div>
                  <div
                    className={`${styles.itemInputWrapper} col-12 col-sm-10`}
                  >
                    <div
                      className="d-flex flex-wrap"
                      style={{ gap: '8px', flex: '1 0 0' }}
                    >
                      {genreName.map((v, i) => {
                        return (
                          <div
                            key={i}
                            className={`${styles.cardBadge} ${styles.genere}`}
                          >
                            {v}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                {/* -------------------------- 地區 -------------------------- */}
                <div className={`${styles.formItem} row`}>
                  <div className={`${styles.itemTitle} col-12 col-sm-2`}>
                    地區
                  </div>
                  <div className={`${styles.infoText} col-12 col-sm-10`}>
                    {jam.region}
                  </div>
                </div>
                {/* -------------------------- 成立日期 -------------------------- */}
                <div className={`${styles.formItem} row`}>
                  <div className={`${styles.itemTitle} col-12 col-sm-2`}>
                    成立日期
                  </div>
                  <div className={`${styles.infoText} col-12 col-sm-10`}>
                    {formedDate}
                  </div>
                </div>
                {/* -------------------------- 樂團介紹 -------------------------- */}
                <div className={`${styles.formItem} row`}>
                  <label
                    className={`${styles.itemTitle} col-12 col-sm-2`}
                    htmlFor="introduce"
                  >
                    樂團介紹
                  </label>
                  <div
                    className={`${styles.itemInputWrapper} col-12 col-sm-10`}
                  >
                    <textarea
                      className={`${styles.textArea} form-control`}
                      placeholder="讓大家認識你們的魅力吧！上限150字"
                      name="introduce"
                      id="introduce"
                      maxLength={150}
                      value={introduce}
                      onChange={(e) => {
                        setIntroduce(e.target.value)
                      }}
                    />
                    {introduceCheck ? (
                      ''
                    ) : (
                      <div
                        className={`${styles.warningText} mt-1 d-none d-sm-block`}
                      >
                        偵測到不雅字詞
                      </div>
                    )}
                  </div>
                  {introduceCheck ? (
                    ''
                  ) : (
                    <div
                      className={`${styles.warningText} d-block d-sm-none p-0`}
                    >
                      偵測到不雅字詞
                    </div>
                  )}
                </div>
              </section>
              <hr style={{ margin: '6px' }} />
              <section className={`${styles.jamLeftSection}`}>
                <div className={`${styles.jamTitle}`}>展示牆</div>
                {/* -------------------------- 團名 -------------------------- */}
                <div className={`${styles.formItem} row`}>
                  <label
                    className={`${styles.itemTitle} col-12 col-sm-2`}
                    htmlFor="yturl"
                  >
                    嵌入影片
                  </label>
                  <div
                    className={`${styles.itemInputWrapper} col-12 col-sm-10 d-flex align-items-center`}
                  >
                    <input
                      type="text"
                      className={`${styles.itemInput} form-control`}
                      name="yturl"
                      id="yturl"
                      placeholder="YouTube網址中 v= 後的字串 例: 3efDUE4ZJYg"
                      value={yturl}
                      onChange={(e) => {
                        setYturl(e.target.value)
                      }}
                    />
                  </div>
                </div>
                {/* ------------------------ 提交修改 -------------------------- */}
                <div className="d-flex justify-content-center gap-5">
                  <Link
                    className="b-btn b-btn-body"
                    style={{ paddingInline: '38px' }}
                    href={`/jam/jam-list/${jam.juid}`}
                  >
                    取消
                  </Link>
                  <div
                    className="b-btn b-btn-primary"
                    style={{ paddingInline: '38px' }}
                    role="presentation"
                    onClick={() => {
                      sendForm(LoginUserData.my_jam, bandName, introduce, selectedFile, yturl)
                    }}
                  >
                    送出
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
              </section>
            </div>
          </div>

          {/*   ---------------------- 成員名單  ---------------------- */}
          <div className={`${styles.jamRightWrapper} col-12 col-sm-4`}>
            <div className={`${styles.jamRight}`}>
              <div
                className={`${styles.jamTitle}`}
                style={{ marginBlock: '10px' }}
              >
                成員名單
              </div>
              <div className="d-flex align-items-center mb-2">
                <div className={`${styles.itemTitle} me-3`}>發起人</div>
                <MemberInfo
                  uid={jam.former.uid}
                  name={jam.former.name}
                  nickname={jam.former.nickname}
                  img={jam.former.img}
                  play={jam.former.play}
                />
              </div>
              <div className="d-flex">
                <div className={`${styles.itemTitle} me-3 mt-1`}>參加者</div>
                <div className="d-flex flex-column gap-2">
                  {jam.member.map((v) => {
                    return (
                      <MemberInfo
                        key={v.uid}
                        uid={v.uid}
                        name={v.name}
                        nickname={v.nickname}
                        img={v.img}
                        play={v.play}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
