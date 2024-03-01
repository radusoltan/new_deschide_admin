import { Editor } from '@tinymce/tinymce-react'
import {useEffect, useState} from "react";
export const BodyEditor = ({initialValue, onEdit, field, images}) => {
  const [value, setValue] = useState()

  useEffect(() => {
    if (initialValue){
      setValue(initialValue ?? '')
    }
    // if (isSuccess){
    //   setImageList([])
    // }

  },[initialValue])
  return <Editor
    apiKey="aywo416v6fszmnbeapee6mhh1rusgyfzjbdetttu6qydo8pu"
    value={initialValue}
    onEditorChange={(newValue, editor)=>{
      setValue(newValue)
      onEdit(newValue)
    }}
    init={{
      height: field==='lead' ? 150 : 500,
      menubar: false,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
        'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | blocks |' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help |'+
          'image',
      // image_list,
      extended_valid_elements: "p[class=text-lg text-amber-700]",
      image_advtab: true,
      a11y_advanced_options: true,
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

    }}
  />
}