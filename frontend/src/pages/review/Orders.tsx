import React from 'react'
import NaLink from 'react-router-dom'
import Header1 from "../../components/Header";
import Navbar from "../../components/Navbar";
import { Input } from 'antd';
import {  Layout } from 'antd';

import type { ColumnsType } from 'antd/es/table';
import { Space, Table, Tag } from 'antd';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Type',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
      <a href='/Createreview'>review</a>
      </Space>
    ),
  },
];

const data: DataType[] = [  //ตัวข้อมูลของตาราง
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];



const Orders = () => {
  return (
    <>
      <Header1 />
      <Navbar />
      <Layout>
        <div className=" h-screen  ">
          <h1 className="text-3xl text-center  card w-96 p-6 shadow-lg m-auto mt-10">
            มังงะของฉัน
          </h1>
          <div className="m-10">
            <h2 className="text-1xl mt-20 text-left ">
              กรุณากรอกคำที่คุณต้องการค้นหา
            </h2>
            <Input className="  w-64   " placeholder="ค้นหา" />
          </div>
          <Table columns={columns} dataSource={data} />
       </div>
          
      </Layout>
    </>
  ); 
};

export default Orders;
