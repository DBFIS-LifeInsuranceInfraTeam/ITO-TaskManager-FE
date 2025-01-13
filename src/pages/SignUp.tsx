import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Typography, Layout, Card, Image } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth/signup";
import { toast } from "react-toastify";
import { getAllProjects } from "../api/user/getAllProjects";
import logo from '../styles/images/logo_v2_black.png'; // 로고 이미지 추가

const { Title } = Typography;
const { Option } = Select;

const SignUp: React.FC = () => {
    
    const navigate = useNavigate();
    const [projectList, setProjectList] = useState([]);
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getAllProjects();
                if (response.status===200 && response.data) {
                    setProjectList(response.data); // 프로젝트 리스트 상태 업데이트
                } else {
                    toast.error("프로젝트 목록을 불러오는 데 실패했습니다.");
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
                toast.error("프로젝트 목록을 불러오는 중 오류가 발생했습니다.");
            }
        };
    
        fetchProjects(); // 비동기 함수 호출
    }, []);
    

    const onFinish = async (values: {
        userId: string;
        name: string;
        password: string;
        confirmPassword: string; // 추가로 받는 값
        unit: string;
        projectId: string;
        email: string;
        phoneNumber: string;
        photo: null;
        position: string;
        admin: false;
    }) => {
        try {
            // confirmPassword 제거
            const { confirmPassword, ...filteredValues } = values;
    
            // API 요청
            const response = await signup({ ...filteredValues, admin: false });
    
            // 응답 확인
            if (response.success === false) {
                // 서버에서 반환된 에러 메시지 표시
                toast.error(response.error || '회원가입에 실패했습니다.');
                return;
            }
    
            // 성공 처리
            toast.success('회원가입 성공!');
            navigate('/login');
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
                    회원가입
                </Title>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{admin:false}}
                >
                    {/* 아이디 */}
                    <Form.Item
                        label="아이디"
                        name="userId"
                        rules={[{ required: true, message: '아이디를 입력해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input size="large" placeholder="아이디를 입력해주세요" />
                    </Form.Item>

                    {/* 비밀번호 */}
                    <Form.Item
                        label="비밀번호"
                        name="password"
                        rules={[{ required: true, message: '비밀번호를 입력해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input.Password size="large" placeholder="비밀번호를 입력해주세요" />
                    </Form.Item>

                    {/* 비밀번호 확인 */}
                    <Form.Item
                        label="비밀번호 확인"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: '비밀번호 확인을 입력해주세요.' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                                },
                            }),
                        ]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input.Password size="large" placeholder="비밀번호를 다시 입력해주세요" />
                    </Form.Item>

                    {/* 이름 */}
                    <Form.Item
                        label="이름"
                        name="name"
                        rules={[{ required: true, message: '이름을 입력해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input size="large" placeholder="이름을 입력해주세요" />
                    </Form.Item>

                    {/* 이메일 */}
                    <Form.Item
                        label="이메일"
                        name="email"
                        rules={[
                            { required: true, message: '이메일을 입력해주세요.' },
                            { type: 'email', message: '유효한 이메일을 입력해주세요.' },
                        ]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input size="large" placeholder="이메일을 입력해주세요" />
                    </Form.Item>

                    {/* 이메일 */}
                    <Form.Item
                        label="전화번호"
                        name="phoneNumber"
                        rules={[
                            { required: true, message: '전화번호를 입력해주세요.' }
                        ]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Input size="large" placeholder="전화번호를 입력해주세요" />
                    </Form.Item>

                    {/* 프로젝트 */}
                    <Form.Item
                        label="프로젝트"
                        name="projectId"
                        rules={[{ required: true, message: '프로젝트를 선택해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Select size="large" placeholder="프로젝트를 선택해주세요">
                        {projectList.map((project: any) => (
            <Option key={project.projectId} value={project.projectId}>
                {project.name}
            </Option>
        ))}
                        </Select>
                    </Form.Item>

                    {/* 파트 */}
                    <Form.Item
                        label="파트"
                        name="unit"
                        rules={[{ required: true, message: '파트를 선택해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Select size="large" placeholder="파트를 선택해주세요">
                            <Option value="OS">OS</Option>
                            <Option value="MW">미들웨어</Option>
                            <Option value="DB">DB</Option>
                            <Option value="NET">네트워크</Option>
                            <Option value="SEC">보안</Option>
                            <Option value="PM">기획/관리</Option>
                            <Option value="SW_DEV">응용SW개발</Option>
                            <Option value="APP_OPS">어플리케이션 개발/운영</Option>
                        </Select>
                    </Form.Item>

                    {/* 직급 */}
                    <Form.Item
                        label="직급"
                        name="position"
                        rules={[{ required: true, message: '직급을 선택해주세요.' }]}
                        style={{ marginBottom: '16px' }}
                    >
                        <Select size="large" placeholder="직급을 선택해주세요">
                            <Option value="프로">프로</Option>
                            <Option value="유닛장">유닛장</Option>
                            <Option value="파트장">파트장</Option>
                            <Option value="팀장">팀장</Option>
                            <Option value="담당">담당</Option>
                            <Option value="사원">사원</Option>
                            <Option value="대리">대리</Option>
                            <Option value="과장">과장</Option>
                            <Option value="차장">차장</Option>
                        </Select>
                    </Form.Item>

                    {/* 제출 버튼 */}
                    <Form.Item style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button size="large" type="primary" htmlType="submit" style={{ width: '100%',borderRadius: '10px' }}>
                            회원가입
                        </Button>
                        <div style={{ marginTop: '10px' }}>
                            이미 계정이 있으신가요?{' '}
                            <Button type="link" style={{ padding: 0 }}>
                                <Link to="/login">로그인하기</Link>
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Card>
        </Layout>
    );
};

export default SignUp;
