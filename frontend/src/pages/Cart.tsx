import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Layout, Typography, Button, Col, Row, Table, Modal, message} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { BasketInterface as Basket } from "../interfaces/IBasket";
import { ComicsInterface as Comic } from "../interfaces/IComics";
import { MemberInterface as Member } from "../interfaces/IMember";
import { GetBaskets, GetComicById, GetMemberById, DeleteBasketByComic } from "../services/http";

const { Title, Text } = Typography;

function Cart() {

  // จำลองผู่้ใช้งาน
  const testUser: Member = {
    ID: 1
  }
  //

  const [user, setUser] = useState<Member>({});

  const getMember = async (mem: Member) => {
    let res = await GetMemberById(mem.ID)
    console.log("Cart user login: ", res);
    setUser({
      ID: res.ID
    });
    console.log("setUser: ", user);
  }

const Columns: ColumnsType<Comic> = [

  {
    title: "",
    dataIndex: "Image",
    width: 100,
    render: (record) => (
      <img src={record.Image} className="w3-left w3-circle w3-margin-right" style={{ width: '100%' }} />
    )
  },
  {
    title: "Title",
    dataIndex: "Title",
    width: 450
  },
  {
    title: "Price (Baht)",
    dataIndex: "Price",
    width: 150
  },
  {
    title: "",
    key: "operation",
    fixed: 'right',
    width: 50,
    render: (record) => 
    <button type="button" onClick={() => handleDeleteClick(record.ID)}>
      Remove
    </button>
  }
]

const [deleteComic, setDeleteComic]= useState<number>(0);
const [DeletePopupOpen, setDeletePopupOpen] = useState(false);
// const [total, setTotal] = useState<number>(0);

const [comicList, setComicList] = useState<Comic[]>([]);

const [messageAPI, contextHolder] = message.useMessage();

const handleDelete = async () => {
  let res = await DeleteBasketByComic(user, deleteComic)
  if (res) {
    messageAPI.info(
      'ลบหนังสือออกจากตะกร้าแล้ว'
    );
  }
  else {
    messageAPI.info(
      'ขออภัย ไม่สามารถลบหนังสือออกจากตะกร้าได้'
    );
  }
}

const handleDeleteClick = (val: number) => {
  setDeleteComic(val);
  console.log("setDeleteComic: ", deleteComic);
  setDeletePopupOpen(true);
}

const setCartDisplay = async () => {
  let res = await GetBaskets(user)
  console.log("Basket from User: ", res);
  if (res) {
    res.forEach((res: Basket) => {
      GetComic(res)
    })
  }
}

const GetComic = async (data: Basket) => {
  let com = await GetComicById(data.ID)
  if (com) {
    console.log("Get Comic: ", com);
    setComicList([...comicList, {
      ID : com.ID,
      CategoryID : com.CategoryID,
      AdminID : com.AdminID,
      Image : com.Image,
      Title : com.Title,
      Description : com.Description,
      Url : com.Url,
      Price : com.Price,  
    }]);
    console.log("Cart List: ", comicList);
  }
}

// const confirmList = async(cid: number | undefined) => {
//   let res = await GetComic(cid)
//   if (res) {
//     setComicList([...comicList, {
// ID : res.ID,
// CategoryID : res.CategoryID,
// AdminID : res.AdminID,
// Image : res.Image,
// Title : res.Title,
// Description : res.Description,
// Url : res.Url,
// Price : res.Price,  
//     }]);
//   }
// }

// const getTotal = (data: ComicsInterface[] | undefined) => {
//   data?.forEach(({Price}) => {
//     setTotal(total + Price)
//   })
// }

useEffect(() => {
  console.log("================================");
  getMember(testUser);
  setCartDisplay();
}, []);

  return (
    <>
      <Header />
      <Navbar />
      <Layout>
            <Row>
                <Col span={6} offset={1}>
                  <p style={{ backgroundColor:"#FFA138", lineHeight: 1.25 , borderRadius: '15px'}}>
                    <Col offset={6}>
                      <Title level={2} style={{lineHeight: 1.75}} >
                        ตะกร้าหนังสือการ์ตูน
                      </Title>
                    </Col>
                  </p>
                </Col>
            </Row>
          <Row>
            {contextHolder}
            <Modal
            title="ลบ Comic ?"
            open={DeletePopupOpen}
            onOk={handleDelete}
            onCancel={() => setDeletePopupOpen(false)}
            />
            <Col span={24}>
              {/* {comicList.map((comicList, index) => {
                return (
                  <div>
                    <h2> Comic: {comicList.Title}</h2>
                  </div>
                )
              })} */}
              <Table 
                rowKey="ID"
                columns={Columns} 
                dataSource={comicList}
                pagination={false}
                summary={ (data) => {
                  let total = 0
                  data.forEach(({ Price }) => {
                    total += Price;
                  });
                  return (
                    <>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                        <Table.Summary.Cell index={1}> Total </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          { <Text type="danger"> { total } </Text> }
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </>
                  );
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={7} offset={11}>
            <Link to="/Payment">
              <Button type="primary" danger size="large" >
                ยืนยันรายการ
              </Button>
            </Link>
            </Col>
          </Row>
      </Layout>
    </>
  );
};

export default Cart;
