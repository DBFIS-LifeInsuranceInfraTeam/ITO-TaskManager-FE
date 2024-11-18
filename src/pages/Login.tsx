// import React from 'react';
// import { Form, Input, Button, Typography, Layout, Card, message } from 'antd';
// import { LockOutlined, UserOutlined } from '@ant-design/icons';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { login } from "../api/auth/login";
// import { toast } from "react-toastify";

// const { Title } = Typography;

// const Login: React.FC = () => {
    
//     const navigate = useNavigate();
//     const location = useLocation();

//     const onFinish = async (values: { userId: string; password: string }) => {
//         try {
//             // Login API 호출
//             const response = await login(values.userId, values.password);
            
//             console.log(response)
//             // 응답 확인
//             if (response.success === false) {
//                 // 서버에서 반환된 에러 메시지 표시
//                 toast.error(response.error.message || '로그인에 실패했습니다.');
//             } else {
//                 // 성공 처리
//                 // 사용자 정보를 sessionStorage에 저장
//                 sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));

//                 toast.success(`${response.data.userInfo.name}님 안녕하세요!`);
//                  // 로그인 성공 후 원래 페이지로 이동 (기본: '/')
//                 const from = location.state?.from?.pathname || '/';
//                 navigate(from, { replace: true });
//                 //navigate('/');
//             }

//         } catch (error) {

//             console.error('Unhandled Error:', error);
//             toast.error('서버와 통신 중 오류가 발생했습니다.');
//         }

//     };

//     return (
//         <Layout
//             style={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 backgroundColor: '#f4f4f4',
//                 padding: '20px',
//             }}
//         >
//             <Card
//                 style={{
//                     maxWidth: '600px',
//                     width: '100%', // 화면 크기에 따라 너비 조정
//                     padding: '20px 40px',
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//                     borderRadius: '10px',
//                 }}
//             >
//                 <Title level={3} style={{ textAlign: 'center', marginBottom: '20px' }}>
//                     로그인
//                 </Title>
//                 <Form
//                     layout="vertical"
//                     onFinish={onFinish}
//                     initialValues={{}}
//                 >
//                     {/* 아이디 */}
//                     <Form.Item
//                         label="아이디"
//                         name="userId"
//                         rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
//                         style={{ marginBottom: '16px' }}
//                     >
//                         <Input prefix={<UserOutlined />} size="large" placeholder="아이디를 입력해주세요" />
//                     </Form.Item>

//                     {/* 비밀번호 */}
//                     <Form.Item
//                         label="비밀번호"
//                         name="password"
//                         rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
//                         style={{ marginBottom: '16px' }}
//                     >
//                         <Input.Password prefix={<LockOutlined/>} size="large" placeholder="비밀번호를 입력해주세요" />
//                     </Form.Item>

//                     {/* 버튼 */}
//                     <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
//                         <Button size="large" type="primary" htmlType="submit" style={{ width: '100%' }}>
//                             로그인하기
//                         </Button>
//                         <div style={{ marginTop: '10px' }}>
//                         아직 계정이 없으신가요?{' '}
//                             <Button type="link" style={{ padding: 0 }}>
//                                 <Link to="/signup">계정 만들기</Link>
//                             </Button>
//                         </div>
//                     </Form.Item>
//                 </Form>
//             </Card>
//         </Layout>
//     );
// };

// export default Login;
import React from 'react';
import { Form, Input, Button, Typography, Layout, Card, Image } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from "../api/auth/login";
import { toast } from "react-toastify";
import logo from '../styles/images/logo_v2_black.png'; // 로고 이미지 추가

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const onFinish = async (values: { userId: string; password: string }) => {
        try {
            const response = await login(values.userId, values.password);
            if (response.success === false) {
                toast.error(response.error.message || '로그인에 실패했습니다.');
            } else {
                sessionStorage.setItem('userInfo', JSON.stringify(response.data.userInfo));
                toast.success(`${response.data.userInfo.name}님 안녕하세요!`);
                
                
                // 저장된 리다이렉트 URL 가져오기
                const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
                sessionStorage.removeItem('redirectUrl'); // 사용 후 제거

                navigate(redirectUrl); // 저장된 URL로 이동
            }
        } catch (error) {
            console.error('Unhandled Error:', error);
            toast.error('서버와 통신 중 오류가 발생했습니다.');
        }
    };

    return (
        <Layout
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to bottom, #ffffff, #f0f2f5)',
                padding: '20px',
            }}
        >
            <Card
                style={{
                    maxWidth: '600px',
                    width: '100%',
                    padding: '30px 40px',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                    borderRadius: '15px',
                    backgroundColor: '#ffffff',
                }}
            >
                {/* 로고 */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Image
                        src={logo}
                        preview={false}
                        alt="logo"
                        style={{ height: '60px' }}
                    />
                </div>

                <Title level={3} style={{ textAlign: 'center', marginTop:'0', marginBottom: '20px', color: '#333' }}>
                    로그인
                </Title>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{}}
                >
                    <Form.Item
                        label="아이디"
                        name="userId"
                        rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            size="large"
                            placeholder="아이디를 입력해주세요"
                            style={{
                                borderRadius: '10px',
                                padding: '10px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label="비밀번호"
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            size="large"
                            placeholder="비밀번호를 입력해주세요"
                            style={{
                                borderRadius: '10px',
                                padding: '10px',
                            }}
                        />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            style={{
                                width: '100%',
                                borderRadius: '10px',
                            }}
                        >
                            로그인하기
                        </Button>
                        <div style={{ marginTop: '15px', fontSize: '14px', color: '#888' }}>
                            아직 계정이 없으신가요?{' '}
                            <Link to="/signup" style={{fontWeight: 'bold' }}>
                                계정 만들기
                            </Link>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    );
};

export default Login;
