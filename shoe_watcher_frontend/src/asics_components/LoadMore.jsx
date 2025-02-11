import React from "react"
import Button from 'react-bootstrap/Button'
import { useSelector, useDispatch } from "react-redux"
import store from "./app/store"
import {selectHasNext} from "./features/searchParameter/searchParamSlice"
import {addToPanel,} from "./features/dataList/panelSlice"
import {updatePagination} from "./features/searchParameter/searchParamSlice"
import { getSearchUrl } from "./HelperFunctions"

function LoadMore() {

    const hasNext = useSelector(selectHasNext)
    const dispatch = useDispatch()
    function load_more()
    {
        console.log("loading more")
        getResult()
    }

    function getResult() {
        const request = new XMLHttpRequest()
        const dataList = []
        request.addEventListener("readystatechange", () => {
          // in async request, ready state 4 is when the request is fully done
          // look at xml readystatechange for what each code means
          if (request.readyState === 4) {
            if (request.status === 200) {
      
              const data = request.responseText
              const dataMap = new Map(Object.entries(JSON.parse(data)))
              dispatch(addToPanel(dataMap.get("result")))
              if (dataMap.get("result").length > 0)
              {
                dispatch(updatePagination({
                  token_key: dataMap.get("token_key"), 
                  token_value: dataMap.get("token_value"),
                  sfccid: dataMap.get("sfccid"),
                  hasNext: dataMap.get("hasNext"),
                }))
              }  
                
            }else{
              console.log("error fetching data")
            }
          }
        })
      
        const jsonData = {
          gender: store.getState().searchParam.value.gender,
          condition: store.getState().searchParam.value.condition,
          shoe_name: store.getState().searchParam.value.shoe_name,
          sorting_style: store.getState().searchParam.value.sorting_style,
          search_limit: store.getState().searchParam.value.search_limit,
          token_key: store.getState().searchParam.value.token_key,
          token_value: store.getState().searchParam.value.token_value,
          sfccid: store.getState().searchParam.value.sfccid,
          hasNext: store.getState().searchParam.value.hasNext,
          min_price:  store.getState().searchParam.value.min_price,
          max_price:  store.getState().searchParam.value.max_price,
        }
        request.open("POST", getSearchUrl("search_engine"))
        request.setRequestHeader("Content-Type", "application/json")
        request.send(JSON.stringify(jsonData))
        return dataList
      }
    
    if (hasNext === true)
    {
        return (        
            <div className='load_more'>
            <Button variant="outline-dark" onClick={load_more} >Load More</Button>{' '}
            </div>)
    }
    else
    {
        return <></>
    }
}

export default LoadMore