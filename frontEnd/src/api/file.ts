import request,{ResponseData} from "./request"

export function uploadImages(data: FormData):Promise<ResponseData> {
    return request({
        url: "/file",
        method: "post",
        headers: {
            "Content-Type": "multipart/form-data"
        },
        data
    });
}