import {AutoComplete, Card, Modal, Spin} from "antd";
import {useAddArticleAuthorsMutation, useGetAllAuthorsQuery} from "../../../../services/authors";
import {useEffect, useState} from "react";
import i18n from "../../../../i18n";

export const SelectArticleAuthors = ({open, onOk, onCancel, article})=>{

  const [options, setOptions] = useState([])
  const {data, isLoading, isSuccess} = useGetAllAuthorsQuery()
  const [addAuthor] = useAddArticleAuthorsMutation()
  const [inputValue, setInputValue] = useState('')
  const [selectedOption, setSelectedOption] = useState()

  const getAuthorName = (author) => {
    if (author.translations && author.translations.length > 0) {
      const translation = author.translations.find(translation => translation.locale === i18n.language);
      if (translation) {
        return translation.first_name+' '+translation.last_name;
      }
    }
    return 'No translation';
  };

  // Funcție pentru a obține id-ul autorului
  const getAuthorId = (author) => {
    if (author.translations && author.translations.length > 0) {
      const translation = author.translations.find(translation => translation.locale === i18n.language);
      if (translation) {
        return translation.id;
      }
    }
    return author.id;
  };

  if (isLoading) return <Spin />


  return <Modal
    open={open}
    onOk={()=>{
      const body = {
        author: parseInt(selectedOption.value),
        locale: i18n.language
      }
      addAuthor({article, body})
      setSelectedOption('')
      setInputValue('')
      onOk()
    }}
    onCancel={()=>{

      onCancel()
    }}
  ><Card>

    <AutoComplete
      allowClear={true}
      options={data?.map(author=>({
        value: String(getAuthorId(author)),
        label: String(getAuthorName(author))
      }))}
      value={inputValue}
      style={{
        width: '100%'
      }}
      onSelect={(data,option)=>{
        setSelectedOption(option)
        setInputValue(option.label)
      }}
      onChange={(data, option)=>{
        console.log(option)
      }}
      onClear={()=>{
        setInputValue('')
        setSelectedOption(null)
      }}
    />

  </Card></Modal>
}