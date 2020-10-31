import React,{Fragment,useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {getposts} from '../../actions/post'
import Spinner from '../layout/spinner'
import PostItem from './PostItem'
import PostForm from './PostForm'

const Posts = ({getposts, post:{posts,loading}}) => {
    useEffect(()=>
    {
    getposts();
    },[getposts])
    return loading ? <Spinner />:(
        <Fragment>
            <h1 className ="large text-primary">Posts</h1>
            <p className='lead'>
                <i className='fas fa-user' /> Welcome to posts
            </p>
            <PostForm />
            <div className="posts">
                {posts.map(post=>(
                    <PostItem key={post._id} post={post} />
                ))}
            </div>
        </Fragment>
    )
}

Posts.propTypes = {
    post:PropTypes.object.isRequired,
    getposts:PropTypes.func.isRequired,
}

const mapStateToProps = state =>({
    post: state.post
})

export default connect(mapStateToProps,{getposts})(Posts)
