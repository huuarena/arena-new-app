import { Button, DropZone, Stack, Thumbnail } from '@shopify/polaris'
import { useCallback, useEffect, useState } from 'react'
import UploadApi from '../../apis/upload'
import AppHeader from '../../components/AppHeader'

function IndexPage(props) {
  const [files, setFiles] = useState([])

  useEffect(() => console.log('files :>> ', files), [files])

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) =>
      setFiles((files) => [...files, ...acceptedFiles]),
    []
  )

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  const handleSubmit = async () => {
    try {
      let res = await UploadApi.upload({ files })
      console.log('res :>> ', res)
    } catch (error) {
      console.log(error)
    }
  }

  const fileUpload = !files.length && <DropZone.FileUpload />
  const uploadedFiles = files.length > 0 && (
    <div style={{ padding: '0' }}>
      <Stack vertical>
        {files.map((file, index) => (
          <Stack alignment="center" key={index}>
            <Thumbnail
              size="small"
              alt={file.name}
              source={
                validImageTypes.includes(file.type) ? window.URL.createObjectURL(file) : NoteMinor
              }
            />
            <div>
              {file.name} <p>{file.size} bytes</p>
            </div>
          </Stack>
        ))}
      </Stack>
    </div>
  )

  return (
    <Stack vertical alignment="fill">
      <AppHeader {...props} title="Test" onBack={() => props.navigate('')} />

      <DropZone onDrop={handleDropZoneDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>

      <Stack distribution="trailing">
        <Button disabled={!Boolean(files?.length)} onClick={handleSubmit}>
          Upload
        </Button>
      </Stack>
    </Stack>
  )
}

export default IndexPage
