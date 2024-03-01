import {
  Button,
  Card,
  Col,
  Divider,
  Image,
  Radio,
  Row,
  Space,
  Spin
} from "antd";
import {
  useDetachArticleImageMutation,
  useGetImagesByArticleQuery,
  useSetArticleMainImageMutation
} from "../../../../services/images";
import {useState} from "react";
import {DeleteOutlined, ScanOutlined, UploadOutlined} from "@ant-design/icons";
import {ArticleImageUploader} from "./Uploader";
import {Link, useParams} from "react-router-dom";
import {Cropper} from "./Cropper";

export const ArticleImages = ()=>{

  const {article} = useParams()

  const [upload, setUpload] = useState(false)
  const [crop, setCrop] = useState(false)

  const {data, isLoading} = useGetImagesByArticleQuery(article)
  const [setArticleMainImage] = useSetArticleMainImageMutation()
  const [detachArticleImage] = useDetachArticleImageMutation()

  if (isLoading) return <Spin />

  const images = data.map(({id,path, isMain, width, height})=><Col key={id} style={{margin: '0 0 0 1em'}}>
    <Card
        cover={
          <Image src={process.env.REACT_APP_URL+path} preview={false} />
        }
        bodyStyle={
          isMain ? {
            background: '#f0f2f5',
            boxShadow: '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)'
          } : {}
        }
    >
      <Divider orientation="right">{width} x {height}</Divider>
      <Radio checked={isMain} onChange={()=>setArticleMainImage({article, image: id})}>Set Main</Radio>
      <Space>
        <Button icon={<DeleteOutlined />} onClick={()=>{detachArticleImage(({article, id}))}} danger></Button>
        {
          isMain ? <Button icon={<ScanOutlined />} onClick={()=>setCrop(true)} /> : ''
        }
      </Space>
    </Card>
  </Col>)

  return <Card title={<Link to={`/content/article/${article}/images`}>Article Images</Link>} extra={<Button
      className="image-card-buttons"
      type="info"
      icon={<UploadOutlined />}
      onClick={()=>setUpload(true)}

    >Upload</Button>}>

    <Row>{images}</Row>
    <ArticleImageUploader
      visible={upload}
      article={article}
      onUpload={()=>{
        setUpload(false)
      }}
      onCancel={()=>{
        setUpload(false)
      }}
    />
    {
      images.length !== 0 ?
         <Cropper
             visible={crop}
             onCancel={()=>setCrop(false)}
             onOk={()=>setCrop(false)}
             image={data.find(({isMain})=>isMain)}
         /> : ''
    }

  </Card>
}