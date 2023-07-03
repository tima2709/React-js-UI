import React from 'react';
import PostItem from "./PostItem";
import {CSSTransition, TransitionGroup} from "react-transition-group";

const PostList = ({posts, title, remove}) => {
    if (!posts.length) {
        return (
            <h1 style={{textAlign: 'center'}}>
                Посты не найдены!
            </h1>
        )
    }
    return (
        <div>
            <h1 style={{textAlign: 'center'}}>
                {title}
            </h1>
            <TransitionGroup>
                {
                    posts.map((post, idx) =>
                        <CSSTransition
                            key={post.id}
                            timeout={500}
                            classNames='post'
                        >
                            <PostItem remove={remove} number={idx + 1} post={post} />
                        </CSSTransition>

                    )
                }
            </TransitionGroup>

        </div>
    );
};

export default PostList;