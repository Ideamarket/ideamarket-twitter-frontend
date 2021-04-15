import classNames from 'classnames'
import React, { useContext, useState, useRef} from 'react'
import copy from 'copy-to-clipboard'

export default function Home() {

const [tagname , setTagname] = useState('elonmusk')
const [market , setMarket] = useState('twitter')
const imgHash  = useState(Date.now())
const [copyDone , setCopyDone] = useState(false);
var dummy1 = ' <img src="https://og-image.ideamarket.io/api/twitter/elonmusk.png" alt="image" /> '
var dummy2 = '<a href="https://app.ideamarket.io/i/twitter/elonmusk" target="_blank">'


const str1 = `<div class="container"><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Rashmi-278/publicCDN@main/embed.css"> `
var str2 = ' <img src="https://og-image.ideamarket.io/api/${market}/${tagname}.png" alt="image" /> '
var str3 = '<a href="https://app.ideamarket.io/i/${market}/${tagname}" target="_blank">'
const str4 = '<button class="btn">Buy</button></a></div>'
var prefinal = str1 + '\n' + dummy1 + '\n' + dummy2 + str4

const [value, setValue] = React.useState(prefinal)
const copyCheckIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-10" viewBox="0 0 20 20" fill="currentColor">
<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
</svg>)

const copyIcon = (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-10" viewBox="0 0 20 20" fill="currentColor">
<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
</svg>)


const createEmbed = (event) => {
    event.preventDefault();
    console.log(tagname + market);
    var str21 = str2.replace("${market}" , market)
    str21 = str21.replace("${tagname}" , tagname)
    var str31 = str3.replace("${market}" , market)
    str31 = str31.replace("${tagname}" ,tagname)
    
    var final = str1 + '\n' + str21 + '\n' + str31 + str4
    setValue(final)
    setCopyDone(false)
    console.log(final)
    }
  

  return (
    <>
      <div className="overflow-x-hidden bg-brand-gray">
        <div className="w-screen px-6 pt-10 pb-40 text-center mb-40  md:mb-5 text-white bg-cover bg-top-mobile md:bg-top-desktop">
          <div>
            <h2 className="text-3xl md:text-6xl font-gilroy-bold">
              Tuning into what{' '}
              <span className="text-brand-blue">matters</span>
            </h2>
            <p className="mt-8 text-lg md:text-2xl font-sf-compact-medium">
              Allow people to voice their trust by embeding ideamarket social
            </p>
          </div>

          

          <div className="flex  mt-20  flex-col items-center justify-center  text-md md:text-3xl font-gilroy-bold md:flex-row">
                <form className="w-full max-w-lg" action="POST" onSubmit={createEmbed} >
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="grid-first-name">
                            Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="tagname" name="tagname" type="text" placeholder="naval"  value={tagname}  onChange={({target}) => setTagname(target.value)}>
                        
                        </input> 
            
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="grid-last-name">
                            Market
                        </label>
                        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"   id="market"
                        name="market"
                        value={market} onChange={({target}) => setMarket(target.value) }
                        placeholder="Select market">
                        <option>twitter</option>
                        <option>youtube</option>
                        <option>substack</option>
                        </select>
                        </div>  
                    </div>
                    <button className="py-2 -mt-2 ml-5 text-lg font-bold text-white rounded-md w-44 font-sf-compact-medium bg-brand-blue hover:bg-blue-800" type="submit" >
                        <div className="flex flex-row items-center justify-center">
                        <div className=" md:ml-2">
                            Generate
                        </div>
                        </div>
                    </button>
                </form>
          
          </div>
           
        </div>



        <div className="flex justify-center items-center sm:mt-48 mb:mt-0">
    <dialog
      open
      className="rounded-2xl overflow-hidden p-0 w-auto max-w-7xl md:mx-auto md:w-2/3 shadow-lg m-8"
    > 
      <div className="flex flex-col lg:flex-row">
        <div
          className="relative h-64 sm:h-80 w-full lg:h-auto lg:w-1/3 xl:w-2/5 flex-none"
        >
          <img
            src={`https://og-image.ideamarket.io/api/${market}/${tagname}.png?${imgHash}`}
            alt=""
            width="480"
            height="480"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            className="absolute block inset-x-0 bottom-0 lg:hidden lg:inset-y-0 lg:right-auto bg-gradient-to-t lg:bg-gradient-to-r from-white to-transparent w-full h-10 lg:h-full lg:w-10"
          ></span>
          <div
            className="relative flex justify-end lg:justify-start flex-wrap text-white text-xl font-bold m-4"
          >
          </div>
        </div>
        <div className="w-full">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold mb-8" >
                Generated code
              </h3>
       
            <button className="outline-none   focus:outline-none  border-gray-200 w-10 h-10 hover:text-green-500 active:bg-gray-50" onClick={()=> {copy(value); setCopyDone(true); console.log("copied!");}} >
                    
            { copyDone ? copyCheckIcon : copyIcon }

                   
            </button>
             
           
            </div>
            <div className="overflow-hidden rounded-md">
            
              <textarea className="w-full px-3 py-5 border border-gray-200 overflow-hidden rounded-md focus:outline-none resize-none"  value={value}  rows={4} ></textarea>
           </div>
              
            <div
              className="flex justify-end items-center text-sm font-bold mt-8 gap-4"
            >
              {/* <a
                className="text-blue-700 border border-blue-300 hover:border-blue-700 px-4 py-1 rounded"
                href="#"
                
              > Copy </a> */}
              
            </div>
          </div>
        </div>
      </div>
    </dialog>
 </div>

       

          {/* <div className="bg-white border border-brand-gray-3 rounded-b-xlg shadow-home">
            <div className="flex flex-col border-b md:flex-row border-brand-gray-3">
              <div className="px-4 md:px-10">
                <div className="font-sf-pro-text">
                  
                </div>
              </div>

            </div>
        
          </div> */}
     

       
      </div>
    </>
  )
}
