import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Card,
  List,
  Image,
  Typography,
  Rate,
  Button,
  Tag,
  Space,
  Form,
  message,
  Modal,
} from "antd";
import { GetMemberById, GetComic, GetCategory, CreateBasket } from "../services/http";
import { ComicsInterface } from "../interfaces/IComics";
import { CategoryInterface } from "../interfaces/ICategory";
import { NavLink, useNavigate } from "react-router-dom";
import { error } from "console";
import { MemberInterface } from "../interfaces/IMember";
import { BasketInterface } from "../interfaces/IBasket";

const { Meta } = Card;
const { Content } = Layout;

const contentStyle: React.CSSProperties = {
  minHeight: 720,
  lineHeight: "120px",
  backgroundColor: "white",
};

const itemCardImage: React.CSSProperties = {
  height: "180px",
  objectFit: "scale-down",
};

const Products: React.FC = () => {
  const [comics, setComics] = useState<ComicsInterface[]>([]);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);

  const [open, setOpen] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();

  const [BasketList, setBasketList] = useState<BasketInterface>();

  // จำลองผู่้ใช้งาน
  const testUser: MemberInterface = {
    ID: 1,
  }
  //

  const [user, setUser] = useState<MemberInterface>({});

  const getComics = async () => {
    let res = await GetComic();
    if (res) {
      setComics(res);
    }
  };

  const getCategories = async () => {
    let res = await GetCategory();
    if (res) {
      setCategories(res);
    }
  };

  const handleAddClick = (val: ComicsInterface) => {
    setBasketList({});
    setBasketList({
      MemberID: user.ID,
      ComicID: val.ID,
      Total: val.Price,
    });
    console.log("Basket: ",BasketList);
    setOpen(true);
  };

  const handleAdd = async() => {
    let res = await CreateBasket(user, BasketList)
    setOpen(false)
    if (res) {
      messageApi.info(
        'เพิ่มหนังสือลงในตะกร้าแล้ว'
      );
    }
    else {
      messageApi.info(
        'ขออภัย ไม่สามารถเพิ่มหนังสือลงในตะกร้าได้'
      );
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  const getMember = async (mem: MemberInterface) => {
    let res = await GetMemberById(mem.ID)
    console.log("user res: ", res);
    setUser({
      ID: res.ID
    });
    console.log("user: ", user);
  }

  useEffect(() => {
    getMember(testUser);
    getComics();
    getCategories();
  }, [])

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Navbar />
      <div className="m-10 border">
        <Form>
          <Content style={contentStyle}>
            <div
              style={{
                textAlign: "center",
                color: "black",
                fontSize: "45px",
                fontWeight: "bold",
              }}
            >
              <h1>Products</h1>
            </div>
            <div>
            {contextHolder}
            <Modal
            title="เพิ่ม Comic ลงในตะกร้า?"
            open={open}
            onOk={handleAdd}
            onCancel={() => handleCancel()}
            />
              <List
                grid={{ gutter: 30, column: 4 }}
                dataSource={comics}
                renderItem={(comic, index) => (
                  <List.Item className="m-5">
                    <Card
                      hoverable
                      cover={
                        <img
                          style={itemCardImage}
                          src={comic.Image}
                          alt={comic.Title}
                          onClick={() => navigate(`/ProfileComic/${comic.ID}`)}
                        />
                      }
                      actions={[
                        <Rate value={3} />,
                        <Button
                          key={comic.ID}
                          style={{
                            backgroundColor: "#29ce2e",
                            color: "white",
                            width: 90,
                            height: 38,
                          }}
                          onClick={() => handleAddClick(comic)}
                        >
                          ฿ {comic.Price}
                        </Button>,
                      ]}
                    >
                      <Meta title={comic.Title} />
                      <Space>
                        {/* Display categories as tags */}
                        {categories
                          .filter(
                            (category) => category.ID === comic.CategoryID
                          )
                          .map((selectedCategory) => (
                            <Tag className="my-4" key={selectedCategory.ID}>
                              {selectedCategory.Name}
                            </Tag>
                          ))}
                      </Space>
                      <Card.Meta
                        description={
                          <Typography.Paragraph
                            ellipsis={{
                              rows: 2,
                              expandable: true,
                              symbol: "more",
                            }}
                          >
                            {comic.Description}
                          </Typography.Paragraph>
                        }
                      />
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </Content>
        </Form>
      </div>
    </>
  );
};

export default Products;
