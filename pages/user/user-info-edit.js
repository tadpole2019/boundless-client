import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/common/navbar'
import Footer from '@/components/common/footer'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import NavbarMb from '@/components/common/navbar-mb'
//
import { debounce } from 'lodash'

//圖片
import jamHero from '@/assets/jam-hero.png'

// 會員認證hook
import { useAuth } from '@/hooks/user/use-auth'
import { jwtDecode } from 'jwt-decode'

//選項資料 data
import CityCountyData from '@/data/CityCountyData.json'
import playerData from '@/data/player.json'
import genreData from '@/data/genre.json'
import { countries, townships, postcodes } from '@/data/cart/twzipcode-data'

// sweetalert
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

// scss
import styles from '@/pages/user/edit.module.scss'

// icons
import { IoHome } from 'react-icons/io5'
import { FaChevronRight } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { FaFilter } from 'react-icons/fa6'
import { FaSortAmountDown } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'
import { IoClose } from 'react-icons/io5'
import { FaCirclePlus } from 'react-icons/fa6'

export default function Test() {
  // ----------------------會員登入狀態 & 會員資料獲取  ----------------------
  //從hook 獲得使用者登入的資訊  儲存在變數LoginUserData裡面
  const { LoginUserData, handleLoginStatus, getLoginUserData, handleLogout } =
    useAuth()
  const router = useRouter()
  //檢查token
  useEffect(() => {
    handleLoginStatus()
    //獲得資料
    getLoginUserData()
  }, [])
  //登出功能
  //檢查是否獲取資料
  // console.log(LoginUserData)
  //   讀取使用者資料後 定義大頭貼路徑
  let avatarImage
  if (LoginUserData.img) {
    avatarImage = `http://localhost:3005/user/${LoginUserData.img}`
  } else if (LoginUserData.photo_url) {
    avatarImage = `${LoginUserData.photo_url}`
  } else {
    avatarImage = `http://localhost:3005/user/avatar_userDefault.jpg`
  }
  //-------------------------------------------------------------
  const appKey = 'userToken'
  // const [userData, setuserData] = useState({
  //   id: '',
  //
  //   name: '',
  //   email: '',
  //   phone: '',
  //   postcode: '',
  //   country: '',
  //   township: '',
  //   address: '',
  //   birthday: '',
  //   genre_like: '',
  //   play_instrument: '',
  //   info: '',
  //   img: '',
  //   gender: '',
  //   nickname: '',
  //   google_uid: '',
  //   photo_url: '',
  //   privacy: '',
  //   my_lesson: '',
  //   my_jam: '',
  // })

  //讓userData有預設值
  const [userData, setuserData] = useState({
    id: '',
    uid: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    postcode: '',
    country: '',
    township: '',
    address: '',
    birthday: '',
    genre_like: '',
    play_instrument: '',
    info: '',
    img: '',
    gender: '',
    nickname: '',
    google_uid: '',
    photo_url: '',
    privacy: '',
    my_lesson: '',
    my_jam: '',
    updated_time: '',
    valid: '',
  })
//---------------------------------------------------

  
  // 縣市連動
  // 記錄陣列的索引值，預設值是-1，相當於"請選擇xxx"
  const [countryIndex, setCountryIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)



  //------獲取單一使用者全部資料 包含密碼
  const getLoginUserProfile = async (e) => {
    // 拿取Token回傳後端驗證狀態
    const Loginusertoken = localStorage.getItem(appKey)

    if (!Loginusertoken) {
      console.error('沒有登入的token 故無法取得使用者資料。')
      return null
    }
    const userID = jwtDecode(Loginusertoken)
    const id = userID.id

    try {
      const response = await fetch(
        `http://localhost:3005/api/user/profile/${id}`,
        {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Loginusertoken}`,
          },
          body: JSON.stringify(),
        }
      )
      const LoginUserProfile = await response.json()
      // console.log('Response from server:', LoginUserData)
      // setUserData(LoginUserData)
      // console.log(LoginUserProfile)
      setuserData(LoginUserProfile)
      // console.log(LoginUserData)
      // 在這裡處理後端返回的資料
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error)
    }
  }

  //-------------------------------------------------------------
  //執行一次，如果有登入，獲得該使用者全部資料寫入userData 狀態
  useEffect(() => {
    if (LoginUserData) {
      getLoginUserProfile()
      
      //   console.log(userData)
    }
  }, []) // 在 LoginUserData.name 改變時觸發 useEffect

  // console.log(userData.id)
  console.log(userData)

  // ----------------------會員登入狀態  ----------------------

  // ----------------------會員資料處理  ----------------------
  // 處理生日
  let finalbirthday = '2000-01-01'

  if (userData.birthday) {
    // 原本處理方式 但和SQL資料庫有時區差異------------
    // birthday = userData.birthday.split('T')[0]

    // testTime = new Date(testTime)
    // const taipeiTime = new Date(testTime.getTime() + 8 * 60 * 60 * 1000)
    // YYYYMMDDTime = taipeiTime.toISOString().slice(0, 19).replace('T', ' ')
    // 原本處理方式 但和SQL資料庫有時區差異------------
    let defaultTime = userData.birthday
    let inputDate = new Date(defaultTime)
    let year = inputDate.getFullYear()
    let month = String(inputDate.getMonth() + 1).padStart(2, '0') // 月份從0開始，需要加1，並保持兩位數
    let day = String(inputDate.getDate()).padStart(2, '0') // 日期需保持兩位數

    finalbirthday = `${year}-${month}-${day}`

    // console.log(finalbirthday)
  }
  useEffect(() => {
    setuserData({ ...userData, birthday: finalbirthday })
  }, [finalbirthday])

  // ---------------曲風-------------
  let totalGenreData = genreData.map((v) => ({
    key: v.id,
    value: v.id,
    label: v.name,
  }))

  let genreLike,
    genreLike1,
    genreLike2,
    genreLike3,
    finalGenreLike = `尚未填寫`
  if (LoginUserData.genre_like) {
    genreLike = LoginUserData.genre_like
    // 使用 split 方法將字串拆分成陣列
    let ArrGenreLike = genreLike.split(',')
    genreLike1 = ArrGenreLike[0]
    genreLike2 = ArrGenreLike[1]
    genreLike3 = ArrGenreLike[2]
  }

  const [genreSelect1, setgenreSelect1] = useState('')
  const [genreSelect2, setgenreSelect2] = useState('')
  const [genreSelect3, setgenreSelect3] = useState('')
  useEffect(() => {
 
    if (genreSelect1 && genreSelect2 && genreSelect3 !== undefined && genreSelect1 !== '9999' && genreSelect2 !== '9999' && genreSelect3 !== '9999') {
      finalGenreLike = `${genreSelect1},${genreSelect2},${genreSelect3}`;
  } else if (genreSelect1 && genreSelect2 !== undefined && genreSelect1 !== '9999' && genreSelect2 !== '9999') {
      finalGenreLike = `${genreSelect1},${genreSelect2}`;
  } else if (genreSelect1 !== undefined && genreSelect1 !== '9999') {
      finalGenreLike = `${genreSelect1}`;
  } else {
      finalGenreLike = ``;
  }

    setuserData({ ...userData, genre_like: finalGenreLike })
  }, [genreSelect1, genreSelect2, genreSelect3])


  // ---------------演奏樂器-------------
  let totalPlayerData = playerData.map((v) => ({
    key: v.id,
    value: v.id,
    label: v.name,
  }))

  let playInstrument,
  playInstrument1,
  playInstrument2,
  playInstrument3,
    finalPlayInstrument = `尚未填寫`
  if (LoginUserData.play_instrument) {
    playInstrument = LoginUserData.play_instrument
    // 使用 split 方法將字串拆分成陣列
    let ArrPlayInstrument = playInstrument.split(',')
    playInstrument1 = ArrPlayInstrument[0]
    playInstrument2 = ArrPlayInstrument[1]
    playInstrument3 = ArrPlayInstrument[2]
  }

  const [playSelect1, setplaySelect1] = useState('')
  const [playSelect2, setplaySelect2] = useState('')
  const [playSelect3, setplaySelect3] = useState('')
  useEffect(() => {
 
    if (playSelect1 && playSelect2 && playSelect3 !== undefined && playSelect1 !== '9999' && playSelect2 !== '9999' && playSelect3 !== '9999') {
      finalPlayInstrument = `${playSelect1},${playSelect2},${playSelect3}`;
  } else if (playSelect1 && playSelect2 !== undefined && playSelect1 !== '9999' && playSelect2 !== '9999') {
    finalPlayInstrument = `${playSelect1},${playSelect2}`;
  } else if (playSelect1 !== undefined && playSelect1 !== '9999') {
    finalPlayInstrument = `${playSelect1}`;
  } else {
    finalPlayInstrument = ``;
  }

    setuserData({ ...userData, play_instrument: finalPlayInstrument })
  }, [playSelect1, playSelect2, playSelect3])

  //-----------------隱私設定進來--------------
  let privacy,
    privacyBD = '',
    privacyPhone = '',
    privacyEmail = '',
    ArrPrivacy,
    finalPrivacy
  if (LoginUserData.privacy) {
    privacy = LoginUserData.privacy
    ArrPrivacy = privacy.split(',')
    privacyBD = ArrPrivacy[0]
    privacyPhone = ArrPrivacy[1]
    privacyEmail = ArrPrivacy[2]
    finalPrivacy = `${privacyBD},${privacyPhone},${privacyEmail}`;
  }

  const [privacySelect1, setprivacySelect1] = useState('9999')
  const [privacySelect2, setprivacySelect2] = useState('9999')
  const [privacySelect3, setprivacySelect3] = useState('9999')
  
  
  useEffect(() => {
    finalPrivacy = `${privacySelect1},${privacySelect2},${privacySelect3}`;
    setuserData({ ...userData, privacy: finalPrivacy })
  }, [privacySelect1, privacySelect2, privacySelect3])
  // console.log(privacyBD)
  // console.log(privacyPhone)
  // console.log(privacyEmail)

  // 頭像上傳-------------------------------------------------------
 

  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);}
 
  // ----------------------會員資料處理  ----------------------

  // ----------------------表單資料傳送處理  ----------------------
  const postForm = async (e) => {
    //取消表單預設submit跳頁
    e.preventDefault()

    const Loginusertoken = localStorage.getItem(appKey)
    if (!Loginusertoken) {
      console.error('沒有登入的token 故無法取得使用者資料。')
      return null
    }
    const userID = jwtDecode(Loginusertoken)
    const id = userID.id
    const res = await fetch(
      `http://localhost:3005/api/user/editProfile/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Loginusertoken}`,
        },
        body: JSON.stringify(userData),
      }
    )
    const result = await res.json()
    console.log(result)
    if (result.status === 'success') {
      postAlert()
    } else {
      console.log(result.error)
    }
  }
  // ----------------------表單資料傳送處理  ----------------------

  //----------------------------sweetalert--------------------------------------
  //登入 跳轉 還沒加入判定 應該要先判斷再跳轉
  
  const mySwal = withReactContent(Swal)
  const postAlert = () => {
    mySwal
      .fire({
        position: 'center',
        icon: 'success',
        iconColor: '#1581cc',
        title: '修改成功，將為您跳轉到會員資訊頁面',
        showConfirmButton: false,
        timer: 2000,
      })
      .then(
        setTimeout(() => {
          router.push(`/user/user-info`).then(() => window.location.reload());
          // window.location.reload();
        }, 2000)
      )
  }
  // ----------------------手機版本  ----------------------
  // 主選單
  const [showMenu, setShowMenu] = useState(false)
  const menuMbToggle = () => {
    setShowMenu(!showMenu)
  }
  // sidebar
  const [showSidebar, setShowSidebar] = useState(false)
  const sidebarToggle = () => {
    setShowSidebar(!showSidebar)
  }
  // ----------------------假資料  ----------------------
  // sidebar假資料
  // const sidebarData = [
  //   '會員資訊',
  //   '我的樂團',
  //   '我的訂單',
  //   '我的文章',
  //   '我的收藏',
  //   '我的優惠券 ',
  //   '我的課程',
  //   '我的訊息',
  // ]

  // 資料排序
  const [dataSort, setDataSort] = useState('latest')
  // ----------------------條件篩選  ----------------------
  // const [filterVisible, setFilterVisible] = useState(false)
  // useEffect(() => {
  //   document.addEventListener('click', (e) => {
  //     setFilterVisible(false)
  //   })
  // }, [])
  // // 阻止事件冒泡造成篩選表單關閉
  // const stopPropagation = (e) => {
  //   e.stopPropagation()
  // }
  // // 顯示表單
  // const onshow = (e) => {
  //   stopPropagation(e)
  //   setFilterVisible(!filterVisible)
  // }
  // filter假資料
  const brandData = [
    { id: 1, name: 'YAMAHA' },
    { id: 2, name: 'Roland' },
    { id: 3, name: 'Fender' },
    { id: 4, name: 'Gibson' },
  ]
  const [brandSelect, setBrandSelect] = useState('all')

  const [priceLow, setPriceLow] = useState('')
  const [priceHigh, setPriceHigh] = useState('')

  // 課程評價
  const scoreState = ['all', '5', '4', '3']
  const [score, setScore] = useState('all')

  // 活動促銷
  const [sales, setSales] = useState(false)

  // 清除表單內容
  const cleanFilter = () => {
    setBrandSelect('all')
    setPriceLow('')
    setPriceHigh('')
    setScore('all')
    setSales(false)
  }



  // ---------------------- 篩選城市用的資料 ----------------------
  const cityData = CityCountyData.map((v, i) => {
    return v.CityName
  }).filter((v) => {
    return v !== '釣魚臺' && v !== '南海島'
  })
  const [region, setRegion] = useState('')

  // const townData = CityCountyData.map((v, i) => {
  //   return v.CityName.AreaList.AreaName
  // }).filter((v) => {
  //   return v !== '釣魚臺' && v !== '南海島'
  // })

  const townData = CityCountyData.flatMap((city) => {
    return city.AreaList.map((area) => {
      return area.AreaName
    })
  }).filter((areaName) => {
    return areaName !== '釣魚臺' && areaName !== '南海島'
  })

  

  return (
    <>
      <Head>
        <title>修改會員資訊</title>
      </Head>
      <Navbar menuMbToggle={menuMbToggle} />
      {/* 先把HEROSECTION隱藏 */}
      {/* <div
        className="page-shero d-none d-sm-block"
        style={{ paddingTop: '60px' }}
      >
        <Image src={jamHero} className="object-fit-cover w-100" alt="cover" />
      </div> */}
      <div className="container position-relative">
        {/* 手機版主選單/navbar */}
        <div
          className={`menu-mb d-sm-none d-flex flex-column align-items-center ${
            showMenu ? 'menu-mb-show' : ''
          }`}
        >
          {/* 用戶資訊 */}
          <NavbarMb/>
        </div>
        <div className="row">
          {/* sidebar */}
          <div className="sidebar-wrapper d-none d-sm-block col-sm-2">
            <div className="sidebar">
              <div className="sidebar-user-info">
                <div className="sidebar-user-info-imgBox">
                  <Image
                    src={avatarImage}
                    alt="user photo mb"
                    fill
                    priority="default" //不加的話Next 會問是否要加優先級
                    sizes="(max-width: 150px)"
                  ></Image>
                </div>
                <div className="sidebar-user-info-text">
                  <div className="sidebar-user-info-name">
                    {LoginUserData.nickname}
                  </div>
                  <div className="sidebar-user-info-band">{LoginUserData.my_jamname}</div>
                </div>
                {/* 更換大頭貼的功能暫定併回會員資訊 故不再sidebar顯示 */}
                {/* <div className="sidebar-user-info-Camera-img">
                  <Image src={avatar} alt="user photo mb" fill></Image>
                </div> */}
              </div>
              <ul className="d-flex flex-column">
                {/* {sidebarData.map((item, index) => {
                  return (
                    <li key={index}>
                      <Link href={`#`}>{item}</Link>
                    </li>
                  )
                })} */}

                <li key={1}>
                  <Link href="/user/user-info">會員資訊</Link>
                </li>
                <li key={2}>
                  <Link href={LoginUserData.jamstate == '1' ?  `/jam/recruit-list/${LoginUserData.my_jam}`: `/user/user-jam`}>我的樂團</Link>
                </li>
                <li key={3}>
                  <Link href="/user/user-order">我的訂單</Link>
                </li>
                <li key={4}>
                  <Link href="/user/user-article">我的文章</Link>
                </li>
                <li key={5}>
                  <Link href="/user/user-coupon">我的優惠券</Link>
                </li>
              </ul>
            </div>
          </div>

          {/*   ----------------------頁面內容  ---------------------- */}

          {/*   ----------------------頁面內容  ---------------------- */}
          <div className="col-12 col-sm-10 page-control">
            {/* 手機版sidebar */}
            <div
              className={`sidebar-mb d-sm-none ${
                showSidebar ? 'sidebar-mb-show' : ''
              }`} style={{top:'190px'}}
            >
              <div className="sm-close">
                <IoClose
                  size={32}
                  onClick={() => {
                    setShowSidebar(false)
                  }}
                />
              </div>

              <Link href={`/user/user-info`} className="sm-item active">
                會員資訊
              </Link>
              <Link href={LoginUserData.jamstate == '1' ?  `/jam/recruit-list/${LoginUserData.my_jam}`: `/user/user-jam`} className="sm-item ">
                我的樂團
              </Link>
              <Link href={`/user/user-order`} className="sm-item">
                我的訂單
              </Link>
              <Link href={`/user/user-article`} className="sm-item">
                我的文章
              </Link>
              <Link href={`/user/user-coupon`} className="sm-item">
                我的優惠券
              </Link>
            </div>
            {/*  ---------------------- 頂部功能列  ---------------------- */}
            <div className="top-function-container">
              {/*  ---------------------- 麵包屑  ---------------------- */}
              <div className="breadcrumb-wrapper-ns">
                <ul className="d-flex align-items-center p-0 m-0">
                  <IoHome size={20} />
                  <li style={{ marginLeft: '8px' }}>會員中心</li>
                  <FaChevronRight />
                  <li style={{ marginLeft: '10px' }}>會員資訊</li>
                </ul>
              </div>

              <div className="top-function-flex">
                {/*  ---------------------- 搜尋欄  ---------------------- */}
                <div className="search-sidebarBtn">
                  <div
                    className="d-flex d-sm-none align-items-center b-btn b-btn-body"
                    role="presentation"
                    style={{ paddingInline: '16px' }}
                    onClick={sidebarToggle}
                  >
                    選單
                  </div>
                </div>
              </div>
            </div>
            {/* 主內容 */}

           

            <main className="content">
              <div className="container custom-container">
                <div className="row">
                  <div
                    className="col-sm-10 col-12"
                    style={{
                      backgroundColor: 'rgb(255, 255, 255)',
                    }}
                  >
                    <div className="user-content col-12">
                      <div className="user-content-top">
                        <div className="user-title-userInfo">會員資訊</div>

                        <div className="user-btnGroup">
                          {/* ※ 點擊&nbsp;
                          <FaCirclePlus
                            size={18}
                            style={{ color: '#18a1ff' }}
                            className="mb-1"
                          />
                          &nbsp;可增加項目 */}
                          {/* <div className="user-btnGroup-btn1">
                            <div>
                              <Link href="/user/user-homepage">
                                預覽個人首頁
                              </Link>
                            </div>
                          </div>
                          <div className="user-btnGroup-btn2">
                            <div>編輯資訊</div>
                          </div> */}
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">頭像</div>
                        <div className="user-info-item-Content-avatar">
                          <div className="user-info-item-contentText-imgBox">
                            <Image
                              src={selectedFile? URL.createObjectURL(selectedFile) : avatarImage }
                              alt="user photo mb"
                              fill
                              priority="default" //不加的話Next 會問是否要加優先級
                              sizes="(max-width: 150px)"
                            ></Image>
                          </div>
                          <div>                          
                            <form
                              action="http://localhost:3005/api/user/upload1"
                              method="post"
                              encType="multipart/form-data"
                              className=""
                            >
                              <div className="input-group d-none mb-2">
                                <span className="input-group-text"></span>
                                <input
                                  type="text"
                                  name="name"
                                  value={LoginUserData.id}
                                  className="form-control"
                                />
                              </div>

                              <div className="input-group mb-2 ">
                                <input
                                  type="file"
                                  name="myFile"
                                  id={LoginUserData}
                                  accept="image/jpeg"
                                  className="form-control"
                                  // onChange={handleFileChange}
                                  onChange={handleFileChange}
                                />
                              </div>
                              
                              <div className="d-flex ">
                                <button className="btn btn-primary ms-auto ">
                                  確認變更
                                </button>
                              </div>
                            </form>
                            {/* //-----------------測試上傳 */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">真實姓名</div>
                        <div className="user-info-item-Content">
                          <div className="user-info-item-contentText">
                            <input
                              type="text"
                              className={`${styles.itemInput} form-control`}
                              placeholder="真實姓名"
                              maxLength={14}
                              value={userData.name}
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  name: e.target.value,
                                })
                              }}
                            />
                            {/* {LoginUserData.name} */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">暱稱</div>
                        <div className="user-info-item-Content">
                          <div className="user-info-item-contentText">
                            <input
                              type="text"
                              className={`${styles.itemInput} form-control`}
                              placeholder="暱稱 上限14字"
                              maxLength={14}
                              value={userData.nickname}
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  nickname: e.target.value,
                                })
                              }}
                            />
                            {/* {LoginUserData.nickname} */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">性別</div>
                        <div className="user-info-item-Content">
                          <div className="user-info-item-contentText">
                            <select
                              className="form-select"
                              style={{ width: 'auto' }}
                              value={userData.gender}
                              name="gender"
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  gender: e.target.value,
                                })
                              }}
                            >
                              <option value="">請選擇</option>
                              <option value="1">男</option>
                              <option value="2">女</option>
                              <option value="3">其他</option>
                            </select>
                            {/* {LoginUserData.gender} */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">喜歡曲風</div>
                        <div className="user-info-item-Content">
                          <div className="user-info-item-contentText">
                            <div
                              className={`${styles.itemInputWrapper} col-12 col-sm-10`}
                            >
                              <div className={`${styles.selectGroup}`}>
                                <select
                                  className="form-select"
                                  style={{ width: 'auto' }}
                                  value={genreSelect1 != '' ? genreSelect1 : genreLike1}                                  
                                  name="genre"
                                  onChange={(e) => {
                                    // let genreLike1 = e.target.value
                                    setgenreSelect1(e.target.value)
                                    if (genreSelect2 == '') {
                                        setgenreSelect2(genreLike2);
                                    }else{
                                      setgenreSelect2(genreSelect2);
                                    }
                                    if (genreSelect3 == '') {
                                        setgenreSelect3(genreLike3);
                                    }else{
                                      setgenreSelect3(genreSelect3);
                                    }                 
                                  }}
                                >
                                  <option  value="9999">無</option>
                                  {genreData.map((v) => {
                                    return (
                                      <option key={v.id} value={v.id}>
                                        {v.name}
                                      </option>
                                    )
                                  })}
                                </select>
                                <select
                                  className="form-select"
                                  style={{ width: 'auto' }}
                                  value={genreSelect2 != '' ? genreSelect2 : genreLike2}
                                  name="genre2"
                                  onChange={(e) => {
                                    // genreLike2 = e.target.value 
                                    setgenreSelect2(e.target.value)
                                    if (genreSelect1 == '') {
                                        setgenreSelect1(genreLike1);
                                    }else{
                                      setgenreSelect1(genreSelect1);
                                    }
                                    if (genreSelect3 == '') {
                                        setgenreSelect3(genreLike3);
                                    }else{
                                      setgenreSelect3(genreSelect3);
                                    }    
                                  }}
                                >
                                  <option  value="9999">無</option>
                                  {genreData.map((v) => {
                                    return (
                                      <option key={v.id} value={v.id}>
                                        {v.name}
                                      </option>
                                    )
                                  })}
                                </select>

                                <select
                                  className="form-select"
                                  style={{ width: 'auto' }}
                                  value={genreSelect3 != '' ? genreSelect3 : genreLike3}
                                  name="genre3"
                                  onChange={(e) => {
                                    setgenreSelect3(e.target.value)
                                    if (genreSelect1 == '') {
                                        setgenreSelect1(genreLike1);
                                    }else{
                                      setgenreSelect1(genreSelect1);
                                    }
                                    if (genreSelect2 == '') {
                                        setgenreSelect2(genreLike2);
                                    }else{
                                      setgenreSelect2(genreSelect2);
                                    }
                                  }}
                                >
                                  <option value="9999">無</option>
                                  {genreData.map((v) => {
                                    return (
                                      <option key={v.id} value={v.id}>
                                        {v.name}
                                      </option>
                                    )
                                  })}
                                </select>
                              </div>
                            </div>
                            {/* {LoginUserData.genre_like} */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">演奏樂器</div>
                        <div className="user-info-item-Content">
                          <div className="user-info-item-contentText">
                          <div
                              className={`${styles.itemInputWrapper} col-12 col-sm-10`}
                            >
                              <div className={`${styles.selectGroup}`}>
                                <select
                                  className="form-select"
                                  style={{ width: 'auto' }}
                                  value={playSelect1 != '' ? playSelect1 : playInstrument1}                                  
                                  name="play"
                                  onChange={(e) => {
                                    setplaySelect1(e.target.value)
                                    if (playSelect2 == '') {
                                        setplaySelect2(playInstrument2);
                                    }else{
                                      setplaySelect2(playSelect2);
                                    }
                                    if (playSelect3 == '') {
                                        setplaySelect3(playInstrument3);
                                    }else{
                                      setplaySelect3(playSelect3);
                                    }                                                                   
                                  }}
                                >
                                  <option  value="9999">無</option>
                                  {playerData.map((v) => {
                                    return (
                                      <option key={v.id} value={v.id}>
                                        {v.name}
                                      </option>
                                    )
                                  })}
                                </select>
                                <select
                                  className="form-select"
                                  style={{ width: 'auto' }}
                                  value={playSelect2 != '' ? playSelect2 : playInstrument2}
                                  name="play2"
                                  onChange={(e) => {
                                    // playLike2 = e.target.value 
                                    setplaySelect2(e.target.value)
                                    if (playSelect1 == '') {
                                        setplaySelect1(playInstrument1);
                                    }else{
                                      setplaySelect1(playSelect1);
                                    }
                                    if (playSelect3 == '') {
                                        setplaySelect3(playInstrument3);
                                    }else{
                                      setplaySelect3(playSelect3);
                                    }  
                                  }}
                                >
                                  <option  value="9999">無</option>
                                  {playerData.map((v) => {
                                    return (
                                      <option key={v.id} value={v.id}>
                                        {v.name}
                                      </option>
                                    )
                                  })}
                                </select>

                                <select
                                  className="form-select"
                                  style={{ width: 'auto' }}
                                  value={playSelect3 != '' ? playSelect3 : playInstrument3}
                                  name="play3"
                                  onChange={(e) => {
                                    setplaySelect3(e.target.value)
                                    if (playSelect2 == '') {
                                        setplaySelect2(playInstrument2);
                                    }else{
                                      setplaySelect2(playSelect2);
                                    }
                                    if (playSelect1 == '') {
                                        setplaySelect1(playInstrument1);
                                    }else{
                                      setplaySelect1(playSelect1);
                                    }  
                                  }}
                                >
                                  <option value="9999">無</option>
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
                            {/* {LoginUserData.play_instrument} */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">公開資訊</div>
                        <div className="user-info-item-checkBoxGroup ">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              id="privacyBD"
                              defaultChecked={privacyBD == '1' ? true : false}
                              onChange={(e)=>{
                                setprivacySelect1(e.target.checked  ? '1' : '0');
                                setprivacySelect1(e.target.checked  ? '1' : '0');
                                if(privacySelect2 == "9999"){
                                  setprivacySelect2(privacyPhone)
                                }else{
                                  setprivacySelect2(privacySelect2)
                                }
                                if(privacySelect3  == "9999"){
                                  setprivacySelect3(privacyEmail)
                                } else{
                                  setprivacySelect3(privacySelect3)
                                }
                                // console.log(privacySelect2)
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="privacyBD"
                            >
                              生日
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              id="privacyPhone"
                              defaultChecked={privacyPhone == '1' ? '1' : ''}
                              onChange={(e)=>{
                                setprivacySelect2(e.target.checked ? '1' : '0');
                                if(privacySelect1 == "9999"){
                                  setprivacySelect1(privacyBD)
                                }else{
                                  setprivacySelect1(privacySelect1)
                                }
                                if(privacySelect3  == "9999"){
                                  setprivacySelect3(privacyEmail)
                                } else{
                                  setprivacySelect3(privacySelect3)
                                }
                                // console.log(privacySelect2)
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="privacyPhone"
                            >
                              手機
                            </label>
                          </div>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              defaultValue=""
                              id="privacyEmail"
                              defaultChecked={privacyEmail == '1' ? "1" : ''}
                              onChange={(e)=>{
                                setprivacySelect3(e.target.checked ? '1' : '0');
                                if(privacySelect2 == "9999"){
                                  setprivacySelect2(privacyPhone)
                                }else{
                                  setprivacySelect2(privacySelect2)
                                }
                                if(privacySelect1  == "9999"){
                                  setprivacySelect1(privacyBD)
                                } else{
                                  setprivacySelect1(privacySelect1)
                                }
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="privacyEmail"
                            >
                              電子信箱
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">生日</div>
                        <div className="user-info-item-Content">
                          <div className="user-info-item-contentText">
                            <input
                              type="date"
                              className={`${styles.itemInput} form-control`}
                              placeholder=""
                              value={finalbirthday}
                              maxLength={20}
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  birthday: e.target.value,
                                })
                              }}
                            />

                            {/* {birthday} */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item">
                        <div className="user-info-item-titleText">手機</div>
                        <div className="user-info-item-Content">
                          <div className="user-info-item-contentText">
                            <input
                              type="tel"
                              className={`${styles.itemInput} form-control`}
                              placeholder="電話號碼"
                              value={userData.phone}
                              maxLength={20}
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  phone: e.target.value,
                                })
                              }}
                            />
                            {/* {LoginUserData.phone} */}
                          </div>
                        </div>
                      </div>

                      <div className="user-info-item">
                        <div className="user-info-item-titleText">地址</div>
                        <div className="user-info-item-Content-address">
                          <div className="user-info-item-contentText d-flex  flex-wrap">
                            <input
                              type="text"
                              className={`${styles.itemInputPostcode} form-control col-sm1 col-3 `}
                              placeholder="郵遞區號"
                              value={userData.postcode}
                              maxLength={3}
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  postcode: e.target.value,
                                })
                              }}
                            />
                            <div className={`${styles.itemInputWrapper} `}>
                              <select
                                className="form-select col-4 col-sm1"
                                style={{ width: 'auto' }}
                                value={userData.country}
                                name="region"
                                onChange={(e) => {
                                  const selectedCountry = countries[e.target.value]
                                  setuserData({
                                    ...userData,
                                    country: e.target.value,
                                    
                                  })
                                  setCountryIndex(e.target.selectedIndex+1)
                                }}
                              >
                                <option disabled value="">請選擇</option>
                                {/* {cityData.map((v, i) => {
                                  return (
                                    <option key={i} value={v}>
                                      {v}
                                    </option>
                                  )
                                })} */}
                                {countries.map((value, index) => (
                                <option key={index} value={value}>
                                  {value}
                                </option>
                              ))}
                              </select>
                            </div>

                            <div className={`${styles.itemInputWrapper}`}>
                              <select
                                className="form-select col-4 col-sm1"
                                style={{ width: 'auto' }}
                                value={userData.township}
                                name="township"
                                onChange={(e) => {
                                  setuserData({
                                    ...userData,
                                    township: e.target.value,
                                  })
                                }}
                              >
                                <option  value="">請選擇</option>
                                {countryIndex == -1 ? townData.map((v, i) => {
                                  return (
                                    <option key={i} value={v}>
                                      {v}
                                    </option>
                                  )
                                }) : ''}
                                {countryIndex > -1 &&
                                townships[countryIndex - 2].map((value, index) => (
                                  <option key={index} value={value}>
                                    {value}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <input
                              type="text"
                              className={`${styles.itemInput} form-control col-sm6 col-12 `}
                              placeholder="地址"
                              // style={{ width: 'auto' }}
                              maxLength={100}
                              value={userData.address}
                              name="address"
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  address: e.target.value,
                                })
                              }}
                            />

                            {/* {LoginUserData.postcode}&nbsp;
                            {LoginUserData.country}
                            {LoginUserData.township}
                            {LoginUserData.address} */}
                          </div>
                        </div>
                      </div>
                      <div className="user-info-item-info">
                        <div className="user-info-item-info-titleText">
                          自我介紹
                        </div>
                        <div className="user-info-item-info2">
                          <div className="user-info-item-info-contentText form-floating">
                            <textarea
                              className="form-control"
                              style={{ height: '200px', width: '100%' }}
                              id="exampleFormControlTextarea1"
                              rows="3"
                              cols="50"
                              defaultValue={userData.info}
                              onChange={(e) => {
                                setuserData({
                                  ...userData,
                                  info: e.target.value,
                                })
                              }}
                            ></textarea>
                            {/* <input
                              type="text"
                              className={`${styles.itemInput} form-control `}
                              placeholder="郵遞區號"
                              maxLength={3}
                              onChange={(e) => {
                                setTitle(e.target.value)
                              }}
                            /> */}

                            {/* {LoginUserData.info} */}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center w-100 m-3 ">
                      <Link href="/user/user-info"     >
                        <div className="b-btn b-btn-danger "
                              style={{ paddingInline: '38px' }}
                              role="presentation"    >
                            
                                                   
                            
                              返回
                            
                          </div>
                          </Link>
                          <div
                            className="b-btn b-btn-primary"
                            style={{ paddingInline: '38px' , marginInline:50}}
                            role="presentation"
                            onClick={(e) => {                           
                              postForm(e)
                            }}
                          >
                            提交
                          </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{`
        /* -------------------user sidebar-------------------- */
        .sidebar-user-info {
          display: flex;
          padding: 0px 12px;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          align-self: stretch;

          /* position: relative; */

          .sidebar-user-info-imgBox {
            width: 100px;
            height: 100px;
            border-radius: 100px;

            /* react Image 要加上這兩條參數 家在外層容器的css , Image本身要fill */

            position: relative;
            overflow: hidden;
          }
          .sidebar-user-info-text {
            display: flex;
            width: 140px;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
            color: var(--dark, #1d1d1d);
            text-align: start;

            /* h5 */
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            .sidebar-user-info-band {
              margin-bottom: 20px;
            }
          }

          .sidebar-user-info-Camera-img {
            width: 30px;
            height: 30px;
            position: absolute;
            left: 85px;
            top: 70px;
            fill: var(--light-gray, #cfcfcf);
          }
        }

        /* -------------------user sidebar-------------------- */

        /* --------------- user-contect-acticle--------------- */

        .custom-container {
          padding: 0;
          color: #000;

          & p {
            font-family: 'Noto Sans TC';
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: #000;
            text-overflow: ellipsis;
          }
          & h5 {
            font-family: 'Noto Sans TC';
            font-size: 20px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            color: var(--primary-deep, #124365);
          }

          .user-content {
            display: flex;
            width: 1070px;
            padding: 20px 10px;
            margin: 0;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            border-radius: 5px;
            background: var(--gray-30, rgba(185, 185, 185, 0.3));
          }

          .user-content {
            max-width: 1076px;
            /* width: 1100px; */
            /* height: 705px; */
            padding-left: 10px;
            padding-right: 10px;
            padding-top: 20px;
            padding-bottom: 20px;
            background: rgba(185, 185, 185, 0.3);
            border-radius: 5px;
            flex-direction: column;
            justify-content: start;
            align-items: flex-start;
            gap: 5px;
            display: inline-flex;
            font-family: Noto Sans TC;
          }

          .user-content-top {
            align-self: stretch;
            justify-content: space-between;
            align-items: flex-start;
            display: inline-flex;
            word-wrap: break-word;
          }

          .user-title-userInfo {
            color: #0d3652;
            font-size: 28px;
            font-weight: 700;
          }

          .user-btnGroup {
            justify-content: flex-start;
            align-items: flex-start;
            gap: 10px;
            display: flex;
            background-color: var(--back);
            font-size: 18px;
            font-weight: 700;
          }

          .user-btnGroup-btn1 {
            padding: 10px;
            background: #b9b9b9;
            border-radius: 5px;
            overflow: hidden;
            justify-content: center;
            align-items: center;
            gap: 10px;
            display: flex;
          }
          .user-btnGroup-btn2 {
            padding: 10px;
            background: #18a1ff;
            border-radius: 5px;
            overflow: hidden;
            justify-content: center;
            align-items: center;
            gap: 10px;
            display: flex;
          }

          /* ------------------ */
          .user-info-item {
            align-self: stretch;
            justify-content: space-between;
            align-items: center;
            display: flex;

            .user-info-item-titleText {
              display: flex;
              color: #124365;
              font-size: 16px;
              font-family: Noto Sans TC;
              font-weight: 700;
              word-wrap: break-word;
            }

            .user-info-item-checkBoxGroup {
              display: flex;
              height: 38px;
              max-width: 900px;
              padding: 3px 0px;
              align-items: center;
              gap: 10px;
              flex: 1 0 0;
              color: #000;
            }

            .user-info-item-Content {
              display: flex;
              height: 38px;
              max-width: 900px;
              padding: 3px 0px;
              align-items: center;
              gap: 10px;
              flex: 1 0 0;

              .user-info-item-contentText {
                flex: 1 1 0;
                color: black;
                font-size: 16px;
                font-family: Noto Sans TC;
                font-weight: 400;
                word-wrap: break-word;
                
              }
            }
            .user-info-item-Content-address{
              display: flex;
              height: 38px;
              max-width: 900px;
              padding: 3px 0px;
              align-items: center;
              gap: 10px;
              flex: 1 0 0;
              
              .user-info-item-contentText {
                flex: 1 1 0;
                color: black;
                font-size: 16px;
                font-family: Noto Sans TC;
                font-weight: 400;
                word-wrap: break-word;
                
              }
            }
            .user-info-item-Content-avatar {
              display: flex;
              height: 138px;
              max-width: 900px;
              padding: 3px 0px;
              align-items: center;
              gap: 30px;
              flex: 1 0 0;

              .user-info-item-contentText-imgBox {
                width: 100px;
                height: 100px;
                border-radius: 100px;
                /* react Image 要加上這兩條參數 家在外層容器的css , Image本身要fill */
                position: relative;
                overflow: hidden;
              }
            }
          }

          .user-info-item-info {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            align-self: stretch;
          }

          .user-info-item-info-titleText {
            color: var(--primary-deep, #124365);
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }

          .user-info-item-info2 {
            display: flex;
            max-width: 900px;
            align-items: center;
            gap: 10px;
            flex: 1 0 0;
          }

          .user-info-item-info-contentText {
            flex: 1 0 0;
            color: #000;
            text-align: justify;
            font-family: 'Noto Sans TC';
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
          }

          .user-orderList-pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            align-self: stretch;
          }
        }

        /*------------- RWD  ----------- */
        @media screen and (max-width: 576px) {
          body {
            padding-inline: 20px;
          }

          .custom-container {
            overflow: hidden;

            .user-content {
              width: 390px;
              padding: 10px;
              overflow: hidden;
              margin-bottom: 20px;

              .user-info-item {
                display: block;
              }

              .user-info-item-info {
                display: block;
              }

              .user-info-item-Content-address{ 
                height: 76px;
              }
            }
          }
          
          /*------------- RWD  ----------- */
        }
      `}</style>
    </>
  )
}
