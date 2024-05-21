import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '@/components/common/navbar'
import NavbarMb from '@/components/common/navbar-mb'
import Footer from '@/components/common/footer'
import Card from '@/components/instrument/card.js'
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import productlistHero from '@/assets/product-list-hero.jpg'
// icons
import { IoHome } from 'react-icons/io5'
import { FaChevronRight } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { FaFilter } from 'react-icons/fa6'
import { FaSortAmountDown } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'
import { IoClose } from 'react-icons/io5'
import Data from '@/data/instrument/instrument.json'
// 自製元件
import BS5Pagination from '@/components/common/pagination'

import { useParams } from 'react-router-dom'

// 會員認證hook
import { useAuth } from '@/hooks/user/use-auth'

export default function Test({ onSearch }) {
  // ----------------------會員登入狀態 & 會員資料獲取  ----------------------
  //從hook 獲得使用者登入的資訊  儲存在變數LoginUserData裡面
  const { LoginUserData, handleLoginStatus, getLoginUserData, handleLogout } =
    useAuth()
  const [userData, setUserData] = useState()
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
    avatarImage = `/user/${LoginUserData.img}`
  } else if (LoginUserData.photo_url) {
    avatarImage = `${LoginUserData.photo_url}`
  } else {
    avatarImage = `/user/avatar_userDefault.jpg`
  }
  // 舊版會警告 因為先渲染但沒路徑 bad
  // const avatarImage = `/user/${LoginUserData.img}`
  // const avatargoogle = `${LoginUserData.photo_url}`
  // const avatarDefault = `/user/avatar_userDefault.jpg`

  // ----------------------會員登入狀態  ----------------------

  const router = useRouter()
  //a
  // console.log(Data)
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

  // ----------------------條件篩選  ----------------------
  const [filterVisible, setFilterVisible] = useState(false)
  useEffect(() => {
    document.addEventListener('click', () => {
      setFilterVisible(false)
    }) //鉤子在組件渲染完成後註冊了一個點擊事件監聽器。當點擊事件發生時，會調用一個函數來將 filterVisible 設置為 false，從而隱藏篩選表單。
  }, []) //這個事件監聽器只會在組件首次渲染時被註冊，並且在組件卸載時被清理。
  // 阻止事件冒泡造成篩選表單關閉//防止觸發組件外部的點擊事件，進而導致篩選表單被關閉。
  const stopPropagation = (e) => {
    e.stopPropagation()
  }
  // 顯示表單
  const onshow = (e) => {
    stopPropagation(e)
    setFilterVisible(!filterVisible)
  }

  // ----------------------假資料  ----------------------
  // 資料排序
  const [dataSort, setDataSort] = useState('upToDate')

  // // sidebar假資料
  // const sidebarData = [
  //   { id: 1, parent_id: null, name: '吉他' },
  //   { id: 2, parent_id: null, name: '貝斯' },
  //   { id: 3, parent_id: null, name: '鍵盤樂器' },
  //   { id: 4, parent_id: null, name: '打擊樂器' },
  //   { id: 5, parent_id: null, name: '弓弦樂器' },
  //   { id: 6, parent_id: null, name: '管樂器' },
  //   { id: 7, parent_id: null, name: '音響設備' },
  //   { id: 8, parent_id: 1, name: '電吉他' },
  //   { id: 9, parent_id: 1, name: '木吉他' },
  // ]
  // filter假資料

  const [brandSelect, setBrandSelect] = useState('')

  const [priceLow, setPriceLow] = useState('')
  const [priceHigh, setPriceHigh] = useState('')
  // 商品評價
  const scoreState = ['all', '5', '4', '3']
  const [score, setScore] = useState('all')

  // 促銷商品
  const [promotion, setPromotion] = useState(false)

  // 清除表單內容
  const cleanFilter = () => {
    setBrandSelect('all')
    setPriceLow('')
    setPriceHigh('')
    setScore('all')
    setPromotion(false)
  }

  // ------------------------------------------------------- 製作分頁
  const [page, setPage] = useState(1)
  const [pageTotal, setPageTotal] = useState(0)
  // 資料排序
  const [orderby, setOrderby] = useState('DESC')
  // 條件品牌
  const [brand, setBrand] = useState('all')
  // 條件關鍵字
  const [keyword, setKeyword] = useState(' ')
  // 商品資料
  const [products, setProducts] = useState([])

  // 在 Test 函數中
  // const [dataPerpage, setDataPerpage] = useState(20)
  // 點按分頁時，要送至伺服器的query string參數
  const handlePageClick = (event) => {
    router.push({
      pathname: router.pathname,

      query: {
        page: event.selected + 1,
        orderby: orderby,
        brandSelect: brandSelect,
        priceLow: priceLow,
        priceHigh: priceHigh,
        score: score,
        promotion: promotion,
        keyword: keyword,
      },
    })
  }

  const handleLoadData = () => {
    // 要送至伺服器的query string參數

    // 註: 重新載入資料需要跳至第一頁
    const params = {
      page: 1, // 跳至第一頁
      orderby: orderby,
      brandSelect: brandSelect,
      priceLow: priceLow,
      priceHigh: priceHigh,
      score: score,
      promotion: promotion,
      keyword: keyword,
    }

    // console.log(params)

    router.push({
      pathname: router.pathname,
      query: params,
    })
  }

  // const hotSales = Data.sort
  //-------------------連資料庫

  const [instrument, setInstrument] = useState([])
  const [productCategory, setProductCategory] = useState([])
  // const [brandData, setBrandData] = useState('')
  const getDatas = async (params) => {
    // 用URLSearchParams產生查詢字串
    // const searchParams = new URLSearchParams(params)
    // console.log(searchParams)

    const searchParams = new URLSearchParams(params)
    const queryString = searchParams.toString()

    console.log(queryString)

    try {
      const res = await fetch(
        `http://localhost:3005/api/instrument?${queryString}`
      )

      // res.json()是解析res的body的json格式資料，得到JS的資料格式
      const datas = await res.json()
      // console.log(datas)
      // 在這裡處理獲取的資料，例如更新狀態
      setInstrument(datas.instrument)
      setProductCategory(datas.category)
      // 設定獲取頁數總合
      setPageTotal(datas.pageTotal)
      // 設定獲取項目
      setPage(datas.page)
      setBrandSelect(datas.brandSelect)
      setPriceLow(datas.priceLow)
      setPriceHigh(datas.priceHigh)
      setKeyword(datas.Keyword)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  // const getDatassearch = async (params) => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:3005/api/instrument/getDatassearch`
  //     )

  //     // res.json()是解析res的body的json格式資料，得到JS的資料格式
  //     const datas = await res.json()

  //     // 在這裡處理獲取的資料，例如更新狀態
  //     setInstrument(datas)
  //   } catch (error) {
  //     console.error('Error fetching data:', error)
  //   }
  // }

  useEffect(() => {
    if (router.isReady) {
      // 從router.query得到所有查詢字串參數
      const {
        orderby,
        page,
        brandSelect,
        priceLow,
        priceHigh,
        score,
        promotion,
        keyword,
      } = router.query
      // 要送至伺服器的query string參數

      // console.log(router.query)

      // 設定回所有狀態(注意所有從查詢字串來都是字串類型)，都要給預設值
      setPage(Number(page) || 1)
      setOrderby(orderby || 'DESC')
      setBrandSelect(brandSelect || 'all')
      setPriceLow(priceLow || '')
      setPriceHigh(priceHigh || '')
      setScore(score || 'all')
      setKeyword(keyword || '')
      setPromotion(promotion || 'false')
      // 載入資料
      getDatas(router.query)
    }

    // eslint-disable-next-line
  }, [router.query, router.isReady])

  // useEffect(() => {
  //   if (router.isReady) {
  //     // 從router.query得到所有查詢字串參數
  //     const { orderby, page, brandSelect, priceLow, priceHigh, score, promotion } =
  //       router.query
  //     // 要送至伺服器的query string參數

  //     // console.log(router.query)

  //     // 設定回所有狀態(注意所有從查詢字串來都是字串類型)，都要給預設值
  //     setPage(Number(page) || 1)
  //     setOrderby(orderby || 'ASC')
  //     setBrandSelect(brandSelect || 'all')
  //     setPriceLow(priceLow || 'all')
  //     setPriceHigh(priceHigh || 'all')
  //     setScore(score || 'all')
  //     setSales(sales || 'all')
  //   }

  //   // eslint-disable-next-line
  // }, [router.query, router.isReady])

  //下面是精簡前的寫法
  // console.log(instrument)
  // useEffect(async () => {
  //   await getInstrument()
  // }, [])
  // function getInstrument() {
  //   return new Promise((resolve, reject) => {
  //     let url = 'http://localhost:3005/api/instrument'
  //     fetch(url, {
  //       method: 'GET',
  //       credentials: 'include',
  //     })
  //       .then((response) => {
  //         return response.json()
  //       })
  //       .then((result) => {
  //         resolve(result)
  //         console.log(result)
  //         setInstrument(result)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         reject()
  //       })
  //   })
  // }

  //-------------------搜尋功能
  const [data, setData] = useState(instrument)

  //-----------------篩選功能 //FIXME
  // 價格篩選
  //確保 priceLow 和 priceHigh 有被定義後再呼叫 priceRange 函式
  // const priceRange = (priceLow, priceHigh) => {
  //   if (priceLow !== '' && priceHigh !== '') {
  //     console.log('priceLow:', priceLow)
  //     console.log('priceHigh:', priceHigh)
  //     fetch(
  //       `http://localhost:3005/api/instrument?priceLow=${priceLow}&priceHigh=${priceHigh}`
  //     )
  //       .then((response) => response.json()) //在網路請求成功時將回應物件轉換為 JSON 格式，並回傳一個新的 Promise 物件。這個新的 Promise 物件會在 JSON 解析成功後被解析，而且 data 參數會包含解析後的 JSON 資料。

  //       .then((data) => setData(data))
  //     setIsFiltered(true)
  //     console.log(data)
  //   }
  // }

  // // 課程評價篩選
  // const scoreState = ['all', '5', '4', '3']
  // const [score, setScore] = useState('all')

  // // 当选中的星级变化时，筛选商品列表
  // useEffect(() => {
  //   //   console.log('当前选择的评分:', score) // 调试日志，查看当前选择的评分
  //   if (score === 'all') {
  //     // console.log('显示所有课程')
  //     setData(instrument)
  //   } else {
  //     const scoreNum = parseInt(score, 10)
  //     // console.log('筛选评分为', scoreNum, '的课程')
  //     const filtered = instrument.filter(
  //       (instrument) => Math.round(instrument.average_rating) === scoreNum
  //     )
  //     // console.log('筛选结果:', filtered) // 调试日志，查看筛选结果
  //     setData(filtered)
  //     setIsFiltered(true)
  //   }
  // }, [score, instrument])

  // 在組件中定義 isFiltered 狀態，並提供一個函數來更新它的值
  const [isFiltered, setIsFiltered] = useState(false)

  const [search, setSearch] = useState('')
  const handleSearch = () => {
    // console.log('按鈕被點擊了')
    let newData
    if (search.trim() === '') {
      newData = instrument
      //   console.log(newData)
    } else {
      newData = instrument.filter((v, i) => {
        return v.name.includes(search)
      })
    }

    setData(newData)
    setIsFiltered(true)
  }

  //-------------------排序功能
  //最熱銷
  const sortBySales = () => {
    const sortedProducts = [...instrument].sort((a, b) => b.sales - a.sales)
    setData(sortedProducts)
    setIsFiltered(true)
  }
  //最高價
  const sortBypriceHigh = () => {
    const sortedProducts = [...instrument].sort((a, b) => b.price - a.price)
    setData(sortedProducts)
    setIsFiltered(true)
  }
  //最低價
  const sortBypriceLow = () => {
    const sortedProducts = [...instrument].sort((a, b) => a.price - b.price)
    setData(sortedProducts)
    setIsFiltered(true)
  }

  //-------------------渲染分類功能li
  const [InstrumentCategory, setInstrumentCategory] = useState([])

  function getInstrumentCategory() {
    return new Promise((resolve, reject) => {
      let url = 'http://localhost:3005/api/instrument/categories'
      fetch(url, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => {
          return response.json()
        })
        .then((result) => {
          resolve(result)
          console.log(result)
          setInstrumentCategory(result)
        })
        .catch((error) => {
          console.log(error)
          reject()
        })
    })
  }

  useEffect(() => {
    getInstrumentCategory()
  }, [])

  //-------------------選定特定分類

  const [selectedCategory, setSelectedCategory] = useState('') // 儲存所選分類
  function handleCategoryChange(id) {
    console.log('Clicked on category with ID:', id)
    // 在這裡執行你的其他邏輯，比如更新狀態
    // 特別處理「全部」選項
    if (id === 0) {
      setSelectedCategory(0) // 使用空字串表示「全部」
    } else {
      setSelectedCategory(id)
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3005/api/instrument/category/${selectedCategory}`
        )
        const data = await response.json()
        console.log(data)

        setData(data) //連回渲染特定分類樂器
      } catch (error) {
        console.error('Error fetching products:', error)
      }
      setIsFiltered(true)
    }
    //當selectedCategory變化後重新取得商品數據
    if (selectedCategory !== '') {
      fetchProducts()
    }
  }, [selectedCategory])

  // 設定sidebar下拉狀態
  const [openAccordion, setOpenAccordion] = useState(null)

  const handleAccordionToggle = (index) => {
    setOpenAccordion(openAccordion === index ? null : index)
  }

  const { category: categoryParam } = useParams() // 從URL參數中得到category值
  const [showHotProducts, setShowHotProducts] = useState(true) // 控制是否顯示熱門課程部分

  useEffect(() => {
    //   如果URL中存在category參數，則隱藏熱銷商品
    if (categoryParam) {
      setShowHotProducts(false)
    } else {
      // 否則顯示熱銷课程
      setShowHotProducts(true)
    }
  }, [categoryParam])

  return (
    <>
      <Head>
        <title>樂器商城</title>
      </Head>
      <Navbar menuMbToggle={menuMbToggle} />
      <div className="hero d-none d-sm-block">
        <Image
          src={productlistHero}
          className="object-fit-cover w-100"
          alt="cover"
        />
      </div>
      <div className="container position-relative">
        {/* 手機版主選單/navbar */}
        <div
          className={`menu-mb d-sm-none d-flex flex-column align-items-center ${
            showMenu ? 'menu-mb-show' : ''
          }`}
        >
          <NavbarMb/>
        </div>

        <div className="row">
          {/* sidebar */}
          <div className="sidebar-wrapper d-none d-sm-block  col-sm-2">
            <div className="sidebar">
              <ul className="d-flex flex-column">
                <li onClick={() => handleCategoryChange(0)}>全部</li>
                {/* 分類功能 */}
                {InstrumentCategory.map((v) => {
                  return v.parent_id === 0 ? (
                    <li
                      className="accordion"
                      style={{ paddingBlock: '15px' }}
                      id={`accordion${v.name}`}
                      key={v.id}
                    >
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${v.name}`}
                            aria-expanded="false"
                            aria-controls={`collapse${v.name}`}
                          >
                            {v.name}
                          </button>
                        </h2>
                        <div
                          id={`collapse${v.name}`}
                          className="accordion-collapse collapse"
                          data-bs-parent={`#accordion${v.name}`}
                        >
                          {InstrumentCategory.map((subv) => {
                            return v.id === subv.parent_id ? (
                              <div
                                className="accordion-body d-flex flex-column px-0 pt-3 pb-0"
                                key={subv.id}
                              >
                                <Link
                                  className="subcategory-link p-2"
                                  href={`/instrument/?category=${subv.name}`}
                                  onClick={() => {
                                    handleCategoryChange(subv.id)
                                    setShowSidebar(false)
                                  }}
                                >
                                  {subv.name}
                                </Link>
                              </div>
                            ) : (
                              ''
                            )
                          })}
                        </div>
                      </div>
                    </li>
                  ) : (
                    ''
                  )
                })}
              </ul>
              {/* <div>
            {recipes.map((recipe) => {
                return <div key={recipe.id}>
                    <h1>{recipe.title}</h1>
                    <img src={recipe.image} alt="recipe image" />
                    {recipe.dishTypes.map((type, index) => {
                        return <span key={index}>{type}</span>
                    })}
                </div>
            })}
        </div> */}
            </div>
          </div>

          {/*   ----------------------頁面內容  ---------------------- */}
          <div className="col-12 col-sm-10 page-control">
            {/* 手機版sidebar */}
            <div
              className={`sidebar-mb d-sm-none ${
                showSidebar ? 'sidebar-mb-show' : ''
              }`}
            >
              <div className="sm-close">
                <IoClose
                  size={32}
                  onClick={() => {
                    setShowSidebar(false)
                  }}
                />
              </div>
              <Link href={`/instrument`} className="sm-item active">
                全部
              </Link>
              {InstrumentCategory.map((v) => {
                return v.parent_id === 0 ? (
                  <li
                    className="accordion sm-item"
                    style={{ paddingBlock: '19px' }}
                    id={`accordion${v.name}`}
                    key={v.id}
                  >
                    <div className="accordion-item w-100">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button collapsed justify-content-between"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${v.name}`}
                          aria-expanded="false"
                          aria-controls={`collapse${v.name}`}
                        >
                          {v.name}
                        </button>
                      </h2>
                      <div
                        id={`collapse${v.name}`}
                        className="accordion-collapse collapse"
                        data-bs-parent={`#accordion${v.name}`}
                      >
                        {InstrumentCategory.map((subv) => {
                          return v.id === subv.parent_id ? (
                            <div
                              className="accordion-body d-flex flex-column px-0 pt-3 pb-0"
                              key={subv.id}
                            >
                              <Link
                                className="subcategory-link p-2"
                                href={`/instrument/${subv.name}`}
                              >
                                {subv.name}
                              </Link>
                            </div>
                          ) : (
                            ''
                          )
                        })}
                      </div>
                    </div>
                  </li>
                ) : (
                  ''
                )
              })}
              <Link href={`/instrument/instrument`} className="sm-item">
                活動專區
              </Link>
            </div>
            {/*  ---------------------- 頂部功能列  ---------------------- */}
            <div className="top-function-container">
              {/*  ---------------------- 麵包屑  ---------------------- */}
              <div className="breadcrumb-wrapper">
                <ul className="d-flex align-items-center p-0 m-0">
                  <IoHome size={20} />
                  <li style={{ marginLeft: '8px' }}>樂器商域</li>
                </ul>
              </div>

              <div className="top-function-flex">
                {/*  ---------------------- 搜尋欄  ---------------------- */}
                <div className="search-sidebarBtn">
                  <div
                    className="d-flex d-sm-none b-btn b-btn-body"
                    role="presentation"
                    style={{ paddingInline: '16px' }}
                    onClick={sidebarToggle}
                  >
                    選單
                  </div>
                  <div className="search input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="請輸入關鍵字..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <div
                      onClick={handleSearch}
                      className="search-btn btn d-flex justify-content-center align-items-center p-0"
                    >
                      <IoIosSearch size={25} />
                    </div>
                  </div>
                </div>
                {/* 手機版排序 */}
                <div className="filter-sort d-flex justify-content-between">
                  <div className="sort-mb d-block d-sm-none">
                    <select
                      className="form-select"
                      value={dataSort}
                      name="dataSort"
                      onChange={(e) => {
                        setDataSort(e.target.value)
                      }}
                    >
                      <option selected value="upToDate">
                        最熱銷
                      </option>
                      <option value="recent">最高價</option>
                      <option value="recent">最低價</option>
                    </select>
                  </div>
                  {/*  ---------------------- 條件篩選  ---------------------- */}
                  <form className="d-flex align-items-center  position-relative">
                    <div
                      className="filter-text d-flex align-items-center me-sm-4"
                      role="presentation"
                      onClick={onshow}
                    >
                      條件篩選
                      <FaFilter size={13} />
                      <div
                        className={`filter ${
                          filterVisible === false ? 'd-none' : 'd-block'
                        }`}
                        onClick={stopPropagation}
                        role="presentation"
                      >
                        {/* 品牌 */}
                        <div className="filter-item">
                          <div className="filter-title">選擇品牌</div>
                          <select
                            className="form-select"
                            aria-label="Default select example"
                            value={brandSelect}
                            name="brand"
                            onChange={(e) => {
                              setBrandSelect(e.target.value)
                            }}
                          >
                            <option selected value="all">
                              全部
                            </option>
                            <option value="1">YAMAHA</option>
                            <option value="2">Roland</option>
                            <option value="3">Ibanez</option>
                            <option value="4">Fender</option>
                            <option value="5">Zildjian</option>
                            <option value="6">Paiste</option>
                            <option value="7">Jupiter</option>
                            <option value="8">LienViolins</option>
                            <option value="9">David Lien</option>
                            <option value="10">Orange</option>
                            <option value="11">其他</option>

                            {/* {brandData &&
                              Array.isArray(brandData) &&
                              brandData.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.name}
                                </option>
                              ))} */}
                          </select>
                        </div>
                        {/* 價格區間 */}
                        <div className="filter-item">
                          <div className="filter-title">價格區間</div>
                          <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="最低價"
                            name="priceLow"
                            value={priceLow}
                            min={0}
                            max={priceHigh - 1}
                            onChange={(e) => {
                              setPriceLow(e.target.value)
                            }}
                          />
                          <input
                            type="number"
                            className="form-control"
                            placeholder="最高價"
                            name="priceHigh"
                            value={priceHigh}
                            min={priceLow + 1}
                            onChange={(e) => {
                              setPriceHigh(e.target.value)
                            }}
                          />
                        </div>
                        {/* 商品評價 */}
                        <div className="filter-item m-0">
                          <div className="filter-title">商品評價</div>
                          <div className="filter-radio-group d-flex flex-wrap justify-content-between">
                            {scoreState.map((v, i) => {
                              return (
                                <div
                                  className="filter-radio-item form-check p-0 mb-3"
                                  key={i}
                                >
                                  <label className="form-check-label">
                                    <input
                                      type="radio"
                                      name="score"
                                      value={v}
                                      checked={v === score}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        setScore(
                                          value === 'all' ? 'all' : value
                                        )
                                      }}
                                    />
                                    &nbsp;{v === 'all' ? '全部' : v + '星'}
                                  </label>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        {/* 促銷商品 */}
                        <div className="filter-item">
                          <div className="form-check">
                            <label className="form-check-label filter-title mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={promotion}
                                name="promotion"
                                onChange={() => {
                                  setPromotion(promotion ? true : false)
                                }}
                              />{' '}
                              促銷商品
                            </label>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                          <div
                            className="filter-btn clean-btn w-100 d-flex justify-content-center"
                            role="presentation"
                            onClick={cleanFilter}
                          >
                            清除
                          </div>
                          <div
                            role="presentation"
                            className="filter-btn confirm-btn w-100 d-flex justify-content-center"
                            onClick={handleLoadData}
                          >
                            確認
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* 資料排序 */}
                  <div className="sort d-none d-sm-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      排序
                      <FaSortAmountDown size={14} />
                    </div>

                    <div className="sort-item active" onClick={sortBySales}>
                      最熱銷
                    </div>
                    <div className="sort-item" onClick={sortBypriceHigh}>
                      最高價
                    </div>
                    <div className="sort-item" onClick={sortBypriceLow}>
                      最低價
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 主內容 */}
            <main className="content">
              {showHotProducts && (
                <div className="hot-instrument">
                  <h4 style={{ color: '#1581cc' }}>熱銷商品</h4>
                  <div className="hot-instrument-card">
                    {instrument
                      .slice() // Create a copy of data array to avoid mutating original array
                      .sort((a, b) => b.sales - a.sales) // Sort courses based on sales volume
                      .slice(0, 4) // Get top 4 courses */
                      .map((v, i) => {
                        return (
                          <div className="" key={i}>
                            {/* 寫discount的判斷式 */}
                            <Card
                              instrument-card
                              id={v.id}
                              puid={v.puid}
                              name={v.name}
                              price={v.price}
                              discount={v.discount}
                              category_name={v.category_name}
                              img_small={v.img_small}
                              sales={v.sales}
                            />
                          </div>
                        )
                      })}
                  </div>
                </div>
              )}
              <hr />

              <div className="instrument-card-group">
                {/* 更改為搜尋過後篩選出來的樂器 */}

                {isFiltered &&
                  // 如果已經進行了篩選或搜索，渲染篩選後的instrument數據
                  data.map((v, i) => {
                    const {
                      id,
                      puid,
                      name,
                      price,
                      discount,
                      category_name,
                      img_small,
                      sales,
                    } = v
                    console.log(v)
                    return (
                      <div className="mb-4" key={id}>
                        <Card
                          id={id}
                          puid={puid}
                          name={name}
                          price={price}
                          discount={discount}
                          category_name={category_name}
                          img_small={img_small}
                          sales={sales}
                        />
                      </div>
                    )
                  })}

                {Array.isArray(instrument) &&
                  !isFiltered &&
                  // 如果没有進行篩選或搜索，渲染原始的instrument數據
                  instrument.map((v, i) => {
                    const {
                      id,
                      puid,
                      name,
                      price,
                      discount,
                      category_name,
                      img_small,
                      sales,
                    } = v
                    return (
                      <div key={id} className="mb-4">
                        <Card
                          id={id}
                          puid={puid}
                          name={name}
                          price={price}
                          discount={discount}
                          category_name={category_name}
                          img_small={img_small}
                          sales={sales}
                        />
                      </div>
                    )
                    console.log(category_name)
                  })}
              </div>
            </main>
            <div className="d-flex justify-content-center">
              <BS5Pagination
                forcePage={page - 1}
                onPageChange={handlePageClick}
                pageCount={pageTotal}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .content {
          display: block;
        }
        .instrument-card-group {
          display: flex;
          margin-block: 30px;
          gap: 35px;
          flex-wrap: wrap;
        }

        .hot-instrument-card {
          margin-block: 30px;
          gap: 10px;
          display: flex;
          justify-content: space-between;
        }
        @media screen and (max-width: 576px) {
          .hot-instrument-card {
            flex-wrap: wrap;
          }
          .instrument-card-group {
            gap: 10px;
          }
          .hot-instrument-card > :global(div) {
            flex-basis: calc(
              40% - 40px
            ); /* Two cards in a row with a 10px gap */
          }
        }
      `}</style>
    </>
  )
}
