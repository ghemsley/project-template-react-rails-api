import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Project } from '../components'
import actions from '../actions'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Link, useLocation } from 'react-router-dom'
import { makeSelectDeduplicatedProjects } from '../selectors'

const Home = React.memo(props => {
  const selectDeduplicatedProjects = useCallback(
    makeSelectDeduplicatedProjects,
    []
  )
  const projects = useSelector(state => selectDeduplicatedProjects(state))
  const { loggedIn, currentUser } = useSelector(state => state.authentication)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(actions.instantiateAllProjects())
  }, [dispatch])

  return (
    <div className='center center-text'>
      <h2 className='recent-projects margin-05'>Recent Projects</h2>
      <Slider
        lazyLoad={true}
        swipeToSlide={true}
        variableWidth={true}
        pauseOnDotsHover={true}
        dots={true}
        infinite={true}
        rows={1}
        speed={250}
        slidesToShow={1}
        slidesToScroll={1}
        adaptiveHeight={true}
        autoplay={true}
        autoplaySpeed={5000}
        centerMode={true}
        focusOnSelect={true}>
        {projects.map(project => (
          <div className='flex project-container'>
            <Project
              project={project}
              showButtons={true}
              showCategories={false}
              key={`project-${project.id}`}
              disablePosition={true}
            />
          </div>
        ))}
      </Slider>
      <div className='title-container'>
        <div className='title-left'>
          <div className='title'>
            <h1>Tada!</h1>
            <h2>Todo List</h2>
            <p>A little todo list app for big plans</p>
          </div>
        </div>
        <div className='title-right flex project-container'>
          <div className='hoverable flex-child flex project fake-project'>
            <div>
              {!loggedIn && !currentUser.id && (
                <p className='tiny-text margin-0 padding-0'>Hover me!</p>
              )}
              <h2>My project</h2>
              <p>A project for the ages</p>
              {!loggedIn && !currentUser.id && (
                <div className='button-container'>
                  <Link
                    to={{
                      pathname: '/signup',
                      state: { background: location }
                    }}
                    className={`pure-button pure-button-primary invisible`}>
                    Sign up
                  </Link>
                </div>
              )}
              <h3 className='margin-05'>Categories</h3>
              <div className='hoverable flex-child rounded category fake-category'>
                <div>
                  <h4 className='margin-05'>Category 1</h4>
                  <p>The best category</p>
                  <h5 className='margin-05'>Todos</h5>
                  <div className='hoverable flex-child rounded todo fake-todo'>
                    <h6>Todo</h6>
                    <p>Come up with a plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Home
