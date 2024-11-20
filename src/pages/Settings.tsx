import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Avatar, Upload, message, Typography, Space, Divider, Tag, Select } from 'antd';
import TuneIcon from '@mui/icons-material/Tune';
import { UserOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd';
import { Option } from 'antd/es/mentions';
import { toast } from "react-toastify";
import { getProjectsByProjectId } from '../api/user/getProjectsByProjectId';
import { updateUserInfo } from '../api/user/updateUserInfo';
import { updateUserProfile } from "../api/user/updateUserProfile";

const { Title, Text } = Typography;

interface Project {
  
  projectId: string;
  name: string;
  description: string;

}

const Settings = () => {
  const [form] = Form.useForm<FormInstance>(); // 명시적 타입 설정
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 선택된 파일 저장
const [profileImage, setProfileImage] = useState<string | null>(null); // 미리 보기 이미지

  const unitCodeToName: Record<string, string> = {
    OS: "OS",
    MW: "미들웨어",
    DB: "DB",
    NET: "네트워크",
    SEC: "보안",
  };

  const [userInfo, setUserInfo] = useState(sessionStorage.getItem("userInfo")
  ? JSON.parse(sessionStorage.getItem("userInfo") as string)
  : null);
  const [projectList, setProjectList] = useState<Project[]>([]); 

  useEffect(() => {
    


     if (userInfo && userInfo.projectId) {
         //setProjectList(userInfo.projectId);
         
         
         const fetchProjectList = async () => {
           try {
               const resProjectList = await getProjectsByProjectId(userInfo.projectId);
               setProjectList(resProjectList);
           } catch (error) {
               console.error("Error fetching users:", error);
           }
       };
       fetchProjectList();
     }

},[userInfo]);



// const handleFinish = async (values: any) => {
//   try {
//     // Combine form values and current user info
//     const updatedUserInfo = {
      
//       ...values, // Merge updated fields
      
//     };

//     console.log(values)
//     // Call the API to update user information
//    const response = await updateUserInfo(userInfo.userId, values); // Replace `updateUserInfo` with your actual API function

//     if (response.code === 200) {

//       const newUserInfo={
//         userId: response.data.userId,
//         name: response.data.name,
//         email: response.data.email,
//         phoneNumber: response.data.phoneNumber,
//         photo: response.data.photo,
//         position: response.data.position,
//         unit: response.data.unit,
//         projectId: response.data.projectId,
//     }
//     console.log(newUserInfo)

//       sessionStorage.setItem("userInfo", JSON.stringify(newUserInfo));
//       setUserInfo(newUserInfo);
//       toast.success("회원정보가 수정되었습니다.");
//       setEditing(false); // Exit editing mode
//     } else {
//       toast.error(response.message || "회원정보 수정에 실패했습니다.");
//     }
//   } catch (error) {
//     console.error("Error updating user information:", error);
//     toast.error("서버와 통신 중 오류가 발생했습니다.");
//   }
// };


const handleFileChange = (file: File) => {
  if (file) {
    setSelectedFile(file); // 파일 상태에 저장

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result as string); // 미리보기 이미지 설정
    };
    reader.readAsDataURL(file); // 파일을 Data URL로 읽음
  } else {
    console.error("파일이 없습니다.");
  }
};

const handleFinish = async (values: any) => {
  try {
    let profileImagePath = userInfo.photo; // 기존 프로필 이미지 경로

    // 1. 파일 업로드
    if (selectedFile) {
      // const formData = new FormData();
      // formData.append("file", selectedFile);

      const uploadResponse = await updateUserProfile(userInfo.userId, {file:selectedFile});

      console.log(uploadResponse.data)
      
      if (uploadResponse.data.code === 200) {
        profileImagePath = uploadResponse.data.data; // 새로 업로드된 이미지 경로
      } else {
        throw new Error("프로필 이미지 업로드 실패");
      }
    }

    // 2. 사용자 정보 업데이트
    const updatedData = { ...values, photo: profileImagePath };
    const response = await updateUserInfo(userInfo.userId, updatedData);

    if (response.data.code === 200) {
      toast.success("회원정보가 성공적으로 업데이트되었습니다.");
      const updatedUserInfo = response.data.data;
      sessionStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setUserInfo(updatedUserInfo); // 상태 갱신
      setEditing(false); // 편집 모드 종료
    } else {
      toast.error(response.data.message || "회원정보 업데이트에 실패했습니다.");
    }
  } catch (error) {
    console.error("Error saving user data:", error);
    toast.error("저장 중 오류가 발생했습니다.");
  }
};


  const tagColors = ['blue', 'green', 'red', 'orange', 'purple']; // 사용할 색상 배열

  return (
    <div
    style={{padding: '40px 0'}}>
      <Card bordered={false} style={{
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Avatar
  size={80}
  src={profileImage || userInfo.photo || 'https://via.placeholder.com/100'}
  icon={!profileImage && <UserOutlined />}
  style={{ marginRight: '20px' }}
/>
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {userInfo.name} {userInfo.position}님, 안녕하세요!
            </Title>
            {editing && (
              <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                handleFileChange(file); // 파일을 상태에 저장
                return false; // 서버로 업로드하지 않음
              }}
              accept="image/*"
            >
                <Button icon={<UploadOutlined />} size="small" style={{ marginTop: '10px' }}>
                  프로필 이미지 변경
                </Button>
              </Upload>
            )}
          </div>
        </div>

        <Divider />

        {editing ? (
          <Form form={form} initialValues={userInfo} onFinish={handleFinish} layout="vertical">
            <Form.Item label="이름" name="name" rules={[{ required: true, message: '이름을 입력해주세요.' }]}>
              <Input size="large"/>
            </Form.Item>
            <Form.Item label="직급" name="position" rules={[{ required: true, message: '직급을 입력해주세요.' }]}>
              <Select size="large" style={{ flex: 1, minWidth: '150px' }} allowClear>
                <Option value="프로">프로</Option>
                <Option value="유닛장">유닛장</Option>
                <Option value="담당">담당</Option>
                <Option value="팀장">팀장</Option>
                <Option value="사원">사원</Option>
                <Option value="대리">대리</Option>
                <Option value="과장">과장</Option>
                <Option value="차장">차장</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="이메일"
              name="email"
              rules={[
                { required: true, message: '이메일을 입력해주세요.' },
                { type: 'email', message: '유효한 이메일을 입력해주세요.' },
              ]}
            >
              <Input size="large"/>
            </Form.Item>
            

  <Form.Item
    label="프로젝트"
    name="projectId"
    rules={[{ required: true, message: '프로젝트를 선택하세요.' }]}
  >
    <Select   size="large" mode="multiple" style={{ width: '100%' }} disabled>
      {projectList.map((project: any) => (
        <Select.Option key={project.projectId} value={project.projectId}>
          {project.name}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>


            <Form.Item label="파트" name="unit" rules={[{ required: true }]}>
              <Select size="large" style={{ flex: 1, minWidth: '150px' }} allowClear>
                <Option value="OS">OS</Option>
                <Option value="MW">미들웨어</Option>
                <Option value="DB">DB</Option>
                <Option value="NET">네트워크</Option>
                <Option value="SEC">보안</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="전화번호"
              name="phoneNumber"
              rules={[
                { required: true, message: '전화번호를 입력해주세요.' },
                { pattern: /^010-\d{4}-\d{4}$/, message: '010-1234-5678 형식으로 입력해주세요.' },
              ]}
            >
              <Input size="large"/>
            </Form.Item>

            <Form.Item style={{display:'flex', width:'100%', justifyContent:'right'}}>
              <Button size="large" type="primary" htmlType="submit">
                저장
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                size="large"
                onClick={() => {
                  setEditing(false);
                  form.resetFields(); // 필드 리셋
                }}
              >
                취소
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{fontSize:'18px', marginRight:'10px'}}>이메일:</Text> 
              <Text style={{fontSize:'16px'}}>{userInfo.email}</Text>
            </div>
            <div>
              <Text strong style={{ fontSize: '18px', marginRight: '10px' }}>프로젝트:</Text>{' '}
              {projectList.map((project: any,index:number) => (
              <Tag key={project.projectId} color={tagColors[index % tagColors.length]} // 색상을 순환적으로 할당
              style={{ marginBottom: '5px' }}>
                <span style={{ fontSize: '16px' }}>{project.name}</span>
              </Tag>
            ))}
              {/* {userInfo.projectId.map((item:string,index:number) => (
                <Tag 
                  key={index} 
                  color={tagColors[index % tagColors.length]} // 색상을 순환적으로 할당
                  style={{ marginBottom: '5px' }}
                >
                  <span style={{ fontSize: '16px' }}>{item}</span>
                </Tag>
              ))} */}
            </div>
            <div>
              <Text strong style={{fontSize:'18px', marginRight:'10px'}}>파트:</Text> 
              <Text style={{fontSize:'16px'}}>{unitCodeToName[userInfo.unit]}</Text>
            </div>
            <div>
              <Text strong style={{fontSize:'18px', marginRight:'10px'}}>전화번호:</Text> 
              <Text style={{fontSize:'16px'}}>{userInfo.phoneNumber}</Text>
            </div>
            <div style={{display:'flex', width:'100%', justifyContent:'right'}}>
            <Button icon={<EditOutlined />} size="large"  type="default" onClick={() => setEditing(true)}>
              정보 수정
            </Button>
            </div>
          </Space>
        )}
      </Card>
    </div>
  );
};

export default Settings;
