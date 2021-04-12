import {gql, useMutation, useQuery} from "@apollo/client";
import {useState} from "react";

export interface IImage {
    id: string
    url: string
}

// TODO: Abstract Apollo queries to separate module
const GET_IMAGES = gql`
    query GetImages {
        images {
            id
            url
        }
    }
`;

const UPLOAD_IMAGE = gql`
    mutation UploadImage($file: FileUpload!) {
        uploadImage(file: $file) {
            filename
        }
    }
`;

export const ImageListing = () => {
    const [file, setFile] = useState<null | File>(null)
    const {loading, data, error } = useQuery(GET_IMAGES)
    const [uploadImage, {data: uploadData, error: uploadError, loading: uploadLoading}] = useMutation(UPLOAD_IMAGE)

    const onChange = (e) => {
        const {validity, files} = e.target
        if (validity.valid) setFile(files[0]);
    }

    return (
        <>
            {!uploadLoading && uploadError && <p>Ah noooo, something went wrong! ... it says: "{uploadError.message}"</p>}
            <input type={'file'} accept={'image/*'} required onChange={onChange} />
            <button
                onClick={ async () => await uploadImage({ variables: {file}}) }
                disabled={!file || uploadLoading}>{uploadLoading ? '...uploading' : 'Upload'}
            </button>
            {uploadData && <p><b>{uploadData.uploadImage.filename}</b> successfully uploaded</p>}
            <div aria-live={'polite'}>
                {loading && <h2>...Loading</h2>}
                {!loading && error && <h2>It broke! ... something about: <i>"{error.message}"</i></h2>}
                {!loading && !data?.length && <h2>No Images to see here 😔</h2>}
                {data?.length && data.map((image: IImage) => (
                    <img src={image.url} alt={''} loading="lazy" />
                ))}
            </div>
        </>
    )
}
