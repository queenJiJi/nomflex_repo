import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "../api";
import styled from 'styled-components';
import { makeImagePath } from '../utils';
import { motion,AnimatePresence } from 'framer-motion';
import {useState} from 'react'


const Wrapper = styled.div`
    background: black;
`;

const Loader = styled.div`
    height:20vh;
    display:flex;
    justify-content:center;
    align-items:center;
`;

const Banner = styled.div<{backgroundPic:string}>`
    height: 100vh;
    display:flex;
    flex-direction:column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1))
        ,url(${(props)=>props.backgroundPic});
    background-size:cover;
`;

const Title = styled.h2`
    font-size:58px;
    margin-bottom:20px;
`;

const Overview = styled.p`
    font-size:29px;
    width:50%;
`;

const Slider = styled.div`
    position: relative;
    top:-250px;
`;

const Row = styled(motion.div)`
    display:grid;
    grid-template-columns:repeat(6,1fr);
    gap:5px;
    // margin-bottom:5px;
    position: absolute;
    width:100%;
`;

const Box= styled(motion.div)<{backgroundPic:string}>`
    background-color: white;
    height:200px;
    color:red;
    font-size:66px;
    background-image:url(${(props)=>props.backgroundPic});
    background-size:cover;
    background-position:center center;
`;

const rowVariants={
    hidden:{ x:window.outerWidth+5 },
    visible:{x:0},
    exit:{x:-window.outerWidth-5}
}

const offset=6; //한번에 보여주고 싶은 영화의 수
//참고로 Index=page이고 Index=3일것임 api에 있는 영화의 개수가 banner에 있는 영화제외하고 18개 뿐인데
//우리가 원하는 한페이지에 나왔으면 하는 영화의 갯수(=offset)가 6이니까

function Home()
{
    const {data, isLoading} = useQuery<IGetMoviesResult>
    (["movies","nowPlaying"],getMovies);
    //console.log( data,isLoading );

    const [index,setIndex] = useState(0);
    const [leaving,setLeaving] = useState(false)
    const increaseIndex=() => {
       if(data)
       {
        if(leaving) return;
        toggleLeaving();
        const totalMovies = data.results.length -1; //-1은 banner로 영화 한개 사용했어서 하나빼주기
        const maxIndex=Math.floor(totalMovies/offset) -1;
        setIndex((prev)=>prev === maxIndex? 0: prev+1);
       }
    }

    const toggleLeaving=()=>setLeaving((prev)=>!(prev))
    
    return <Wrapper>
        {isLoading? (<Loader>Loading...</Loader>) : 
       ( <>
            <Banner onClick={increaseIndex} backgroundPic={makeImagePath(data?.results[0].backdrop_path || "")}>
                <Title>{data?.results[0].title}</Title>
                <Overview>{data?.results[0].overview}</Overview>
            </Banner> 

            <Slider>
                <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                 <Row 
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{type:"tween",duration:1.5}}
                    key={index}
                >
                    {/* slice(1)을 해주는 이유는 배경사진으로 하나 사용했으니까 array중에서 이걸 제외해줘야해서 그런거임
                        index가 page같은 것임, offset이 끝점!
                    */}
                   {data?.results.slice(1).slice(offset*index,offset*index+offset).map((movie)=>
                   (<Box 
                        key={movie.id} 
                        backgroundPic={makeImagePath(movie.backdrop_path,"w500")}
                    />))}
                 </Row>
                </AnimatePresence>
            </Slider>
         </>)
        }
    </Wrapper>;
}

export default Home;