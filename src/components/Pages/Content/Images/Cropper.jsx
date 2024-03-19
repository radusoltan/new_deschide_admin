import {Card, Col, Image, Modal, Row, Spin} from "antd";
import {ReactCrop} from "react-image-crop";
import {useEffect, useRef, useState} from "react";
import {useDebounceEffect} from "../../../../lib/utils";
import {canvasPreview} from "./CanvasPreview";
import 'react-image-crop/dist/ReactCrop.css'
import {useCropImageMutation, useGetImageThumbnailsQuery, useGetRenditionsQuery} from "../../../../services/thumbnails";
import {centerCrop, makeAspectCrop} from "react-image-crop";

const centerAspectCrop = (mediawidth,mediaHeight,aspect) => (centerCrop(
    makeAspectCrop(
        {
          unit: '%',
          width: 90
        },
        aspect,
        mediawidth,
        mediaHeight
    ),
    mediawidth,
    mediaHeight
))

export const Cropper = ({visible, onCancel, onOk, image}) => {

  const imageRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const { data: imageThumbnails, isLoading: imageThumbnailsLoading, isSuccess: imageThumbnailsSuccess } = useGetImageThumbnailsQuery(image.id)
  const {data: renditions, isLoading: renditionsLoading, isSuccess: renditionsSuccess} = useGetRenditionsQuery()
  const [cropImage] = useCropImageMutation()

  const [selectedRendition,setSelectedRendition] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [aspect,setAspect] = useState()

  const [crop,setCrop] = useState(centerAspectCrop(image.width, image.height, 16/9))

  const saveCrop = ()=>{
    cropImage({
      image: image.id,
      rendition: selectedRendition,
      crop: {p:completedCrop,c:crop}
    })
  }

  const selectRendition = id => {
    setSelectedRendition(id)
    const th = imageThumbnails.find(thumb=>thumb.rendition_id===selectedRendition)

    const {aspect,coords, width, height} = renditions.find(rendition=>rendition.id===id)
    setAspect(aspect)
    setCrop(
        centerAspectCrop(width, height, aspect)
    )

  }

  useEffect(() => {
    if (renditionsSuccess){

      setSelectedRendition(renditions[0].id);
      setCrop(
        centerAspectCrop(renditions[0].width,renditions[0].height,renditions[0].aspect)
      )
      setAspect(renditions[0].aspect)
    }

  }, [renditionsSuccess,imageThumbnailsSuccess]);

  useDebounceEffect(
      async () => {
        if (
            crop?.width &&
            crop?.height &&
            imageRef.current &&
            previewCanvasRef.current
        ){
          canvasPreview(
              imageRef.current,
              previewCanvasRef.current,
              crop,
              1
          )
        }
      }, 100, [crop]
  )

  if (
      imageThumbnailsLoading ||
      renditionsLoading
  ){
    return <Spin />
  }

  const thumbnails = imageThumbnails?.map(({id, rendition_id, coords, rendition, path, name})=><div key={id}>
    <Card
      cover={
        completedCrop && selectedRendition === rendition_id ?
          <canvas ref={previewCanvasRef} /> :
          <Image src={process.env.REACT_APP_URL+path} preview={false} />
      }
      hoverable
      onClick={()=>{
        selectRendition(rendition_id)
      }}
      bodyStyle={
        selectedRendition === rendition_id ? {
          background: '#f0f2f5',
          boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
        } : {}
      }
    >

    </Card>
  </div>)

  return <Modal
    width='70%'
    open={visible}
    onCancel={onCancel}
    onOk={()=>{
      saveCrop()
      setSelectedRendition(null)
      setCompletedCrop(null)
      setAspect(null)
      setCrop(null)
      onOk()
    }}
  >
    <Row>
      <Col span={4}>{thumbnails}</Col>
      <Col span={20}>
        <Card>
          <ReactCrop
            aspect={aspect} crop={crop}
            onChange={(c,p)=>{
              setCrop(p)
              setCompletedCrop(p)
            }}
            onComplete={(c,p)=>{
            setCompletedCrop(p)
            setCrop(c)
            saveCrop()
          }}>
            <img ref={imageRef} src={process.env.REACT_APP_URL+image.path} alt={'image'}/>
          </ReactCrop>
        </Card>
      </Col>
    </Row>
  </Modal>
}