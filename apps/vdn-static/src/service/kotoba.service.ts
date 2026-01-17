import axios from "axios";
import SERVER_URL from "./web.service"
import type { SearchResult } from "@repo/common/dto";

export default class KotobaService {

	public static search(search_term:string){
		return axios.get<SearchResult>(`${SERVER_URL}/search`, 
			{params:{ search_term }});
	}

}