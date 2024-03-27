import {Button, Card, List} from "antd";
import {
  useDeleteArticleFromListMutation,
  useGetListQuery,
  useUpdateOrderMutation
} from "../../../../services/articlesList";
import {DeleteFilled} from "@ant-design/icons";
import {useParams} from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import {useEffect, useState} from "react";

export const SelectedList = ({list, onOk, onCancel})=>{

  const {data, isLoading, isSuccess} = useGetListQuery(list)
  const [deleteArticleFromList] = useDeleteArticleFromListMutation()
  const [updateOrder] = useUpdateOrderMutation()

  const [itemsList, setItemsList] = useState([])

  useEffect(() => {

    if (isSuccess){

      setItemsList(data)

    }

  }, [isSuccess, data])

  const handleDrop = (droppedItem)=>{
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    let updatedList = [...itemsList];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State

    updateOrder({
      list,
      body: itemsList.map((item,index)=>({
        id: item.id,
        order: index+1
      }))
    })

    setItemsList(updatedList);

  }

  return <Card>
    <DragDropContext onDragEnd={handleDrop}>
      <Droppable droppableId="list">
        {provided=>(
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <List>
            {itemsList.map((item, index)=>(
              <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                {provided=>(
                  <div
                    ref={provided.innerRef}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                  >
                    <List.Item
                      actions={[
                        <Button
                          icon={<DeleteFilled />}
                          danger type="primary"
                          onClick={()=>{
                            // console.log(item.article.id)
                            deleteArticleFromList({list,article:item.article.id})
                          }}
                        />
                      ]}
                    >
                      <List.Item.Meta title={item.article.title} />
                    </List.Item>
                  </div>
                )}
              </Draggable>
            ))}
            </List>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </Card>
}