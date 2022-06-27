const API_KEY = "c279c1a56697b089b1c6e5747d05b4b4"
const BASE_PATH = "https://api.themoviedb.org/3"

//function that will bring the movie db; fetcher는 데이터를 받아오고 JSON을 리턴하는 함수에 불과

interface IMovie {
    id:number;
    backdrop_path:string;
    poster_path:string;
    title:string;
    overview:string;
}

export interface IGetMoviesResult {
    dates: {
        maximum: string;
        minimum: string;
    };
    page:number,
    results: IMovie[],
    total_pages:number,
    total_results:number
}

export function getMovies()
{
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`
    ).then(
        (response)=>response.json()
    );
}

