import React, {useEffect, useRef, useState} from 'react';
import '../styles/app.css'
import {usePosts} from "../hooks/usePosts";
import PostService from "../API/PostService";
import {useFetching} from "../hooks/useFetching";
import {getPageCount} from "../utils/pages";
import MyButton from "../componets/UI/button/MyButton";
import PostForm from "../componets/PostForm";
import MyModal from "../componets/UI/MyModal/MyModal";
import PostFilter from "../componets/PostFilter";
import PostList from "../componets/PostList";
import Pagination from "../componets/UI/pagination/Pagination";
import Loader from "../componets/UI/loader/loader";
import MySelect from "../componets/UI/select/MySelect";


const Posts = () => {
    const [posts, setPosts] = useState([])

    // const bodyInputRef = useRef();

    // const [selectedSort, setSelectedSort] = useState('')
    // const [searchQuery, setSearchQuery] = useState('')

    const [filter, setFilter] = useState({sort: '', query: ''})
    const [modal, setModal] = useState(false)

    const [totalPages, setTotalPages] = useState(0)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)
    const lastElement = useRef()
    const observer = useRef()
    // console.log(lastElement)

    const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
        const response = await PostService.getAll(limit, page)
        setPosts([...posts, ...response.data])
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    useEffect(() => {
        if(isPostsLoading) return;
        if(observer.current) observer.current.disconnect()
        var callback = function(entries, observer) {
            if (entries[0].isIntersecting && page < totalPages) {
                setPage(page + 1)
                // console.log(page)
                // console.log("ДИВ В ЗОНЕ ВИДИМОСТИ")
// теперь колбэк отрабатывает когда элемент в зоне видимости
            }
            // console.log("ДИВ В ЗОНЕ ВИДИМОСТИ")
            //здесь колбэк отрабатывает когда элемента в зоне видимости и на исчезание элемента из зоны видимости
            // console.log(entries, 'entries') // intersecting = поля видимости
        };
        observer.current = new IntersectionObserver(callback);
        observer.current.observe(lastElement.current)
    }, [isPostsLoading])

    useEffect(() => {
        fetchPosts(limit, page)
    }, [page, limit])


    const createPost = (newPost) => {
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) => {
        setPosts(posts.filter(el => el.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)

    }

    // const sortPosts = (sort) => {
    //     setSelectedSort(sort)
    // }


    return (
        <div className={'App'}>
            <MyButton style={{marginTop: '30px'}}
                      onClick={() => setModal(true)}
            >
                Создать пользователя
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin: '15px 0'}}/>
            <PostFilter filter={filter} setFilter={setFilter}/>
            <MySelect
            value={limit}
            onChange={value => setLimit(value)}
            defaultValue="Кол-во элементов на странице"
            options={[
                {value: 5, name: '5'},
                {value: 10, name: '10'},
                {value: 25, name: '25'},
                {value: -1, name: 'Показать всё'},
            ]}
            />
            {postError &&
                <h1>Произошла ошибка ${postError}</h1>
            }
            <PostList remove={removePost} posts={sortedAndSearchedPosts} title={'Посты про JS'}/>
            <div
                ref={lastElement}
                style={{height: 20, background: 'red'}}
            />

            {isPostsLoading &&
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px'}}><Loader/></div>
            }
            <Pagination
                page={page}
                changePage={changePage}
                totalPages={totalPages}
            />


        </div>
    );
};

export default Posts;

/*alt enter чтобы импортировать*/

// form = по умолчанию в форму когда мы добавляем
// кнопку тип у него SUBMIT и в браузере по умолчанию
// когда происходит submit формы страница обновляется
// и данные иэ этой формы уходят на сервер.
// Это можно предотвратить с помощью e.preventDefault() тем самым предотвращая дефолтное поведение браузера


//Как получить данные из не управляемого инпута с помощью useRef хуком
// useRef() = с помощью этого хука мы можем получить доступ к DOM элементу
// и уже у этого DOM элемента забрать value. console.log(bodyInputRef.current.value) Для это у инпута указываем пропс ref  и
// передаем созданную useRef ссылку. MyInput = React.forwardRef((props, ref)
//<MyInput
//                     ref={bodyInputRef}
//                     type="text"
//                     placeholder='Описание поста'
//                 />


// Функция sort не возвращает новый отсортированный массив, а мутирует тот массив к которому это функция была применена
// состояние напрямую изменять нельзя
// setPosts([...posts].sort((a, b)=> a[sort].localeCompare(b[sort])))
// разворачиваем посты в новый массив и отсортируем этот массив, в данном случае мы мутируем копию массива, и не мутируем состояние на прямую


// хук useMemo(callback, deps= массив зависимости)
// callback должен возвращать резулютат каких то вычислений, например отсортированный массив или
// отфильтрованный массив, какие математические операции, в общем результат вычислений
// В массив зависимости можно передавать какие то переменные, поля объекта
//Для чего нужен хук useMemo = она производит вычисления (в данном случае сортирует массив),
// запоминает результат этих вычислений и каширует подобное поведение называется Мемоизация и за каждую перерисовку
// компонента она не пересчитывает заново она не сортирует массив вновь, она достает отсортированный массив из кэша,
// но каждый раз когда какая-то из зависимостей изменилась например мы выбрали другой алгоритм сортировки не по заголовку,
// а по описанию то функция вновь пересчитывает и кэширует результат выполнения до тех пор пока одна опять одна из зависимостей
// не изменится, если массив зависимости пусто то он сработает лишь единожды запомнит результат и больше вызвана не будет