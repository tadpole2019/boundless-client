import { useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '@/components/common/navbar'
import NavbarMb from '@/components/common/navbar-mb'
import Footer from '@/components/common/footer'
import Link from 'next/link'
import Image from 'next/image'
import articleHero from '@/assets/article-hero.png'
// icons
import { MdNoteAdd } from 'react-icons/md'
import { IoHome } from 'react-icons/io5'
import { FaChevronRight } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { FaFilter } from 'react-icons/fa6'
import { FaSortAmountDown } from 'react-icons/fa'
import bookmarkIconFill from '@/assets/fillbookmark.svg'
import bookmarkIcon from '@/assets/emptybookmark.svg'
import { ImExit } from 'react-icons/im'
import { IoClose } from 'react-icons/io5'
import ArticleCard from '@/components/article/article-card'
import BS5Pagination from '@/components/common/pagination'
// 會員認證hook
import { useAuth } from '@/hooks/user/use-auth'

export default function ArticleList() {
  // ----------------------手機版本  ----------------------
  // 後端資料庫
  const [article, setArticle] = useState([])
  const [search, setSearch] = useState('')

  // // 資料排序
  const [dataSort, setDataSort] = useState('latest')

  const filterArticle = useMemo(() => {
    // 首先根據排序條件對文章進行排序
    let sorted = []
    if (dataSort === 'latest') {
      sorted = article.sort(
        (a, b) => new Date(b.published_time) - new Date(a.published_time)
      )
    } else if (dataSort === 'oldest') {
      sorted = article.sort(
        (a, b) => new Date(a.published_time) - new Date(b.published_time)
      )
    } else {
      sorted = article
    }

    // 然後應用搜索過濾器
    return sorted.filter((article) => {
      return article.title.includes(search)
    })
  }, [article, dataSort, search])

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
  console.log(LoginUserData)
  //   讀取使用者資料後 定義大頭貼路徑
  let avatarImage
  if (LoginUserData.img) {
    avatarImage = `http://localhost:3005/user/${LoginUserData.img}`
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

  // 全部article資料
  useEffect(() => {
    const getDatas = async () => {
      try {
        const res = await fetch(`http://localhost:3005/api/article`)
        const datas = await res.json()
        if (datas) {
          setArticle(datas) // 設定獲取的文章數據到狀態中
          console.log(datas)
        }
      } catch (e) {
        console.error(e)
      }
    }
    getDatas() // 在元件渲染後立即獲取文章數據
  }, []) // 空的依賴陣列表示只在元件第一次渲染時執行一次

  // article-category資料
  // const [articleCategory, setArticleCategory] = useState([])
  // function getArticleCategory() {
  //   return new Promise((resolve, reject) => {
  //     let url = 'http://localhost:3005/api/article/categories'
  //     fetch(url, {
  //       method: 'GET',
  //       credentials: 'include',
  //     })
  //       .then((response) => {
  //         return response.json()
  //       })
  //       .then((result) => {
  //         resolve(result)
  //         //   console.log(result)
  //         setArticleCategory(result)
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //         reject()
  //       })
  //   })
  // }
  // useEffect(() => {
  //   getArticleCategory()
  // }, [])

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

  // ----------------------功能  ----------------------

  // ------------------分類category_id的資料庫------------------------
  // const filterArticle = useMemo(() => {
  //   return article.filter((v) => {
  //     // 檢查文章的標題是否包含搜尋關鍵字
  //     const titleMatch = v.title.includes(search)
  //     // 檢查文章的 category_id 是否為 2
  //     const categoryIdMatch = v.category_id === 2
  //     // 將上述條件組合起來，若兩者皆符合則返回 true，否則返回 false
  //     return titleMatch && categoryIdMatch
  //   })
  // }, [article, search])

  // ----------------------分類功能  ----------------------

  // 純func書籤
  const handleToggleFav = (id) => {
    const newArticles = article.map((v, i) => {
      if (v.id === id) return { ...v, fav: !v.fav }
      else return v
    })
    setArticle(newArticles)
  }

  const router = useRouter()

  return (
    <>
    <Head>
      <title>
        樂友論壇
      </title>
    </Head>
      <Navbar menuMbToggle={menuMbToggle} />
      <div className="page-shero d-none d-sm-block">
        <Image src={articleHero} className="object-fit-cover w-100" alt="cover" />
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
          {/* -----------sidebar------------ */}
          <div className="sidebar-wrapper d-none d-sm-block col-sm-2">
            <div className="sidebar">
              <ul className="d-flex flex-column">
                <li>
                  <Link href={`/article/article-list`} className="active">
                    全部
                  </Link>
                </li>
                <li>
                  <Link href={`/article/article-list/comments`}>音樂評論</Link>
                </li>
                <li>
                  <Link href={`/article/article-list/sharing`}>技術分享</Link>
                </li>
              </ul>
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
              <Link href={`/article/article-list`} className="sm-item active">
                全部
              </Link>
              <Link href={`/article/article-list/comments`} className="sm-item">
                音樂評論
              </Link>
              <Link href={`/article/article-list/sharing`} className="sm-item">
                技術分享
              </Link>
            </div>
            {/*  ---------------------- 頂部功能列  ---------------------- */}
            <div className="top-function-container">
              {/*  ---------------------- 麵包屑  ---------------------- */}
              <div className="breadcrumb-wrapper">
                <ul className="d-flex align-items-center p-0 m-0">
                  <IoHome size={20} />
                  <li style={{ marginLeft: '8px' }}>樂友論壇</li>
                </ul>
              </div>

              <div className="top-function-flex">
                {/*  ---------------------- 手機搜尋欄  ---------------------- */}
                <div className="search-sidebarBtn">
                  <div
                    className="d-flex d-sm-none align-items-center b-btn b-btn-body"
                    role="presentation"
                    style={{ paddingInline: '16px' }}
                    onClick={sidebarToggle}
                  >
                    選單
                  </div>
                  <div className="search input-group">
                    <input
                      className="form-control"
                      placeholder="請輸入關鍵字..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      type="search"
                    />
                    <div
                      // onClick={handleSearch}
                      className="search-btn btn d-flex justify-content-center align-items-center p-0"
                    >
                      <IoIosSearch size={25} />
                    </div>
                  </div>
                </div>
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
                      <option selected value="latest">
                        新到舊
                      </option>
                      <option value="oldest">舊到新</option>
                    </select>
                  </div>

                  {/* ---------------------- 資料排序  ---------------------- */}
                  <div className="sort d-none d-sm-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      排序
                      <FaSortAmountDown size={14} />
                    </div>
                    <div
                      className={`sort-item ${
                        dataSort === 'latest' ? 'active' : ''
                      }`}
                      role="presentation"
                      onClick={(e) => {
                        setDataSort('latest')
                      }}
                    >
                      新到舊
                    </div>
                    <div
                      className={`sort-item ${
                        dataSort === 'oldest' ? 'active' : ''
                      }`}
                      role="presentation"
                      onClick={(e) => {
                        setDataSort('oldest')
                      }}
                    >
                      舊到新
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* 主內容 */}
            <main className="content me-2">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="pt-2" style={{color:'#1581cc'}}>
                  熱門文章
                </h4>
                {/* <Link
                  href={`/article/article-list/article-publish`}
                  className="icon-btn"
                >
                  <MdNoteAdd
                    size={35}
                    style={{ color: 'gray', cursor: 'pointer' }}
                  />
                  發布文章
                </Link> */}
                {LoginUserData.uid ? (
                  <Link
                    href={`/article/article-list/article-publish`}
                    className="icon-btn"
                  >
                    <MdNoteAdd
                      size={35}
                      style={{ color: 'gray', cursor: 'pointer' }}
                    />
                    發布文章
                  </Link>
                ) : (
                    <Link
                      href={`/login`}
                      className="icon-btn"
                    >
                      <MdNoteAdd
                        size={35}
                        style={{ color: 'gray', cursor: 'pointer' }}
                      />
                    發布文章
                    </Link>
                )}
              </div>
              <div className="content-pop d-flex flex-wrap">
                {filterArticle.slice(0, 4).map((v, i) => {
                  {
                    /* 熱門文章的分類目前是抓前4筆 */
                  }
                  const {
                    id,
                    auid,
                    title,
                    content,
                    img,
                    user_id,
                    author,
                    published_time,
                    articles,
                    fav,
                    category_name,
                    comment_likes,
                    article_author_name,
                    article_author_img,
                  } = v
                  return (
                    <ArticleCard
                      key={id}
                      id={id}
                      auid={auid}
                      user_id={user_id}
                      title={title}
                      content={content}
                      img={img}
                      author={author}
                      category_name={category_name}
                      published_time={published_time}
                      articles={articles}
                      handleToggleFav={handleToggleFav}
                      fav={fav}
                      comment_likes={comment_likes}
                      article_author_name={article_author_name}
                      article_author_img={article_author_img}
                    />
                  )
                })}
              </div>
              <hr />
              <div className="content-pop d-flex flex-wrap">
                {filterArticle.map((v, i) => {
                  const {
                    id,
                    auid,
                    title,
                    content,
                    img,
                    user_id,
                    author,
                    published_time,
                    articles,
                    fav,
                    category_name,
                    comment_likes,
                    article_author_name,
                    article_author_img,
                  } = v
                  return (
                    <ArticleCard
                      key={id}
                      id={id}
                      auid={auid}
                      title={title}
                      content={content}
                      img={img}
                      user_id={user_id}
                      author={author}
                      published_time={published_time}
                      articles={articles}
                      fav={fav}
                      category_name={category_name}
                      handleToggleFav={handleToggleFav}
                      comment_likes={comment_likes}
                      article_author_name={article_author_name}
                      article_author_img={article_author_img}
                    />
                  )
                })}
              </div>
            </main>
            {/* <div className="d-flex justify-content-center">
              <BS5Pagination
                forcePage={page - 1}
                onPageChange={handlePageClick}
                pageCount={pageTotal}
              />
            </div> */}
          </div>
        </div>
      </div>
      <Footer />

      <style jsx>{``}</style>
    </>
  )
}
