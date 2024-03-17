import {AutoComplete, Card, Form, Modal, Spin} from "antd";
import {useAddArticleAuthorsMutation, useGetAllAuthorsQuery} from "../../../../services/authors";
import {useEffect, useState} from "react";
import i18n from "../../../../i18n";

export const SelectArticleAuthors = ({open, onOk, onCancel, article})=>{

  const [inputValue, setInputValue] = useState('')
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')

  const {data, isLoading, isSuccess} = useGetAllAuthorsQuery()
  const [addAuthor] = useAddArticleAuthorsMutation()

  useEffect(() => {
    if (isSuccess){
      setOptions(data.map(author=>{
        if (author.translations.length === 0){
          return {
            value: String(),
            label: "No Full Namw Author Translation"
          }
        } else {
          return {
            value: String(author.id),
            label: String(author.translations.find(({locale})=>locale===i18n.language).full_name)
          }
        }
      }))
    }
  }, [isSuccess]);

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
      setSelectedOption('')
      setInputValue('')
      onCancel()
    }}
  ><Card>
    <AutoComplete
      value={inputValue}
      allowClear={true}
      options={options}
      onSelect={(data, option)=>{
        setSelectedOption(option)
        setInputValue(option.label)
      }}
      onChange={(data, option)=>{
        setInputValue(data);
        setSelectedOption(option);
      }}
      onSearch={(text)=>{
        // Caută opțiunea care se potrivește cel mai bine cu textul introdus
        const matchingOption = options.find(option =>
            option.label.toLowerCase().includes(text.toLowerCase())
        );

        // Dacă s-a găsit o opțiune potrivită, selecteaz-o și actualizează valoarea inputului
        if (matchingOption) {
          setSelectedOption(matchingOption);
          setInputValue(matchingOption.label);
        }

      }}
      filterOption={(value,option)=>{
        console.log('filter', option)
      }}
      style={{
        width: '100%'
      }}
      onClear={()=>{
        setSelectedOption('')
        setInputValue('')
      }}
      placeholder="Input here"
    />
  </Card></Modal>
}