import {AutoComplete, Card, Modal, Spin} from "antd";
import {useAddArticleAuthorMutation, useAuthorsSearchMutation, useGetAuthorsQuery} from "../../../../services/articles";
import {useEffect, useState} from "react";
import i18n from "../../../../i18n";

export const SelectArticleAuthors = ({open, onOk, onCancel, article})=>{

  const [locale, setLocale] = useState(i18n.language)

  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState()
  const {data, isLoading, isSuccess} = useGetAuthorsQuery()
  const [value, setValue] = useState('')
  const [searchAuthor,{data: result, isSuccess: resultSuccess}] = useAuthorsSearchMutation()
  const [addAuthor] = useAddArticleAuthorMutation()


  const onChange = data => {
    setValue(data)
    searchAuthor(data)
  }


  const onSelect = (data, option) => {
    setSelectedOption(option)
    setValue(option.label)
  }

  i18n.on('languageChanged', locale=>setLocale(locale))

  useEffect(() => {
    if (isSuccess){

      setOptions(data.map(({id, translations})=>{
        if(translations.length===0){
          return {
            value: String(id),
            label: "NO Full Name Author TRanslations"
          }
        } else {
          return {
            value: String(id),
            label: translations.find(translation=>translation.locale===locale) ? String(translations.find(translation=>translation.locale===locale).full_name) : "No translation"
          }
        }
      }))

    }
    if (resultSuccess){
      setOptions(result.map(({id, translations})=>{
        if(translations.length===0){
          return {
            value: String(id),
            label: "NO Full Name Author TRanslations"
          }
        } else {
          return {
            value: String(id),
            label: translations.find(translation=>translation.locale===locale) ? String(translations.find(translation=>translation.locale===locale).full_name) : "No translation"
          }
        }
      }))
    }
  }, [isSuccess, locale, resultSuccess, data, result]);

  if (isLoading) return <Spin />


  return <Modal
    open={open}
    onOk={()=>{

      addAuthor({
        article,
        body: {
        author: parseInt(selectedOption.value),
        locale
      }})

      onOk()
      setValue('')
      setSelectedOption(null)
    }}
    onCancel={()=>{

      onCancel()
    }}
  ><Card>

    <AutoComplete
      allowClear={true}
      options={options}
      onSelect={onSelect}
      onChange={onChange}
      onClear={()=>setValue('')}
      style={{
        width: '100%',
      }}
      value={value}
    />

  </Card></Modal>
}