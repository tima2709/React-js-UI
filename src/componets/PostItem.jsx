import React from 'react';
import MyButton from "./UI/button/MyButton";
import {useNavigate} from 'react-router-dom'
const PostItem = (props) => {
const router = useNavigate()
    const goPosts = () => router(`/posts/${props.post.id}`)
    return (
        <div className="post">
            <div className="post__content">
                <strong>{props.post.id}. {props.post.title}</strong>
                <div>
                    {props.post.body}
                </div>
            </div>
            <div className="post__btns">
                <MyButton
                    onClick={goPosts}
                >
                    Открыть
                </MyButton>
                <MyButton
                    onClick={() => props.remove(props.post)}
                >
                    Удалить
                </MyButton>
            </div>
        </div>
    );
};

export default PostItem;