import {GET_PROFILE,PORFILE_ERROR,CLEAR_PROFILE,UPDATE_PROFILE,GET_PROFILES,GET_GITREPOS} from '../actions/types'

const initialstate = {
    profile:null,
    profiles:[],
    repos:[],
    loading: true,
    error:{}
  };

  export default function(state=initialstate,action)
  {
      const {type,payload}=action
      switch(type)
      {
        case GET_PROFILE:
        case UPDATE_PROFILE:
            return {...state,profile:payload,loading:false}
        case GET_PROFILES:
            return {...state,profiles:payload,loading:false}
        case PORFILE_ERROR:
            return{...state,error:payload,loading:false,profile:null}
        case CLEAR_PROFILE:
            return{...state,profile:null,loading:false,repos:[]}
        case GET_GITREPOS:
            return {...state,repos:payload,loading:false}
        default:
            return state
      }
  }