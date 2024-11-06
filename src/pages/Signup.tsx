import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css'; // Import the CSS file for styling
import { signup } from '../api/signup';
import logo from '../styles/image/logo-black.png';
import { getAllProjects } from '../api/getAllProjects';

interface Project {
    projectId: string;
    name: string;
}

const Signup:React.FC = () => {
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordCheck, setPasswordCheck] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [projectId, setProjectId] = useState<string>('');
    const [unit, setUnit] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    //프로젝트 선택 가능 리스트
    const [projectList, setProjectList] = useState<Project[]>([]);
    // 버튼이 활성화되었는지 여부를 계산하는 함수
    const isButtonEnabled = userId.trim() !== '' && password.trim() !== '' && 
    passwordCheck.trim() !== '' && name.trim() !== '' && 
    phoneNumber.trim() !== '';
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchProjectList = async () => {
            
                try {
                    const resProjectListData = await getAllProjects();
                    console.log(resProjectListData)
                    setProjectList(resProjectListData);
                } catch (error) {
                    console.error("Error fetching statistics:", error);
                }
            }
        fetchProjectList();
    }, []);


    const handleSignup = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        
        try {
            const userData = {
                userId,
                name,
                password,
                unit,
                projectId,
                email,
                phoneNumber,
                photo: null, // or a file/image if provided
                position,
                admin: false
            };

            const response = await signup(userData);
            console.log("Signup successful:", response);
            // Redirect or update state after successful signup here
            navigate('/login');
            
        } catch (error) {
            setError("이미 가입된 사용자입니다.");
        }
    };

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={logo} alt=""/>
        </div>
        <div className={styles.formContainer}>
            <form onSubmit={handleSignup}>
                <div className={styles.inputGroup}>
                    <label htmlFor="userId">아이디</label>
                    <input 
                        type="text" 
                        id="userId" 
                        value={userId} 
                        onChange={(e) => setUserId(e.target.value)} 
                        placeholder="아이디를 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="password">비밀번호</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="비밀번호를 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="passwordCheck">비밀번호 확인</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={passwordCheck} 
                        onChange={(e) => setPasswordCheck(e.target.value)} 
                        placeholder="비밀번호를 재입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">이메일</label>
                    <input 
                        type="text" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="이메일 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">이름</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="이름을 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phoneNumber">전화번호</label>
                    <input 
                        type="string" 
                        id="phoneNumber" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="전화번호를 입력하세요." 
                        required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="projectId">프로젝트</label>
                    <select 
            id="projectId" 
            value={projectId} 
            onChange={(e) => setProjectId(e.target.value)} 
            required
          >
                    {projectList && projectList.length > 0 ? (
            <>
              <option value="">프로젝트를 선택하세요.</option>
              {projectList.map((project) => (
                <option key={project.projectId} value={project.projectId}>
                  {project.name}
                </option>
              ))}
            </>
          ) : (
            <option disabled>선택 가능한 프로젝트가 없습니다.</option>
          )}
          </select>
                    {/* <input 
                        type="string" 
                        id="projectId" 
                        value={projectId} 
                        onChange={(e) => setProjectId(e.target.value)} 
                        placeholder="팀을 입력하세요." 
                        required 
                    /> */}
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="unit">유닛</label>
                    {/* <input 
                        type="string" 
                        id="unit" 
                        value={unit} 
                        onChange={(e) => setUnit(e.target.value)} 
                        placeholder="유닛을 입력하세요." 
                        required 
                    /> */}
                    <select 
            id="unit" 
            value={unit} 
            onChange={(e) => setUnit(e.target.value)} 
            required
          >
            <option value="">유닛을 선택하세요.</option>
            <option key="OS" value="OS">
                  OS
                </option>
                <option key="MW" value="MW">
                  미들웨어
                </option>
                <option key="DB" value="DB">
                  DB
                </option>
                <option key="NET" value="NET">
                  네트워크
                </option>
                <option key="SEC" value="SEC">
                  보안
                </option>
          </select>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="position">직급</label>
                    {/* <input 
                        type="string" 
                        id="position" 
                        value={position} 
                        onChange={(e) => setPosition(e.target.value)} 
                        placeholder="직급을 입력하세요." 
                        required 
                    /> */}

<select 
            id="position" 
            value={position} 
            onChange={(e) => setPosition(e.target.value)} 
            required
          >
            <option value="">직급을 입력하세요.</option>
               <option key="프로" value="프로">
                  프로
                </option>
                <option key="사원" value="사원">
                    사원
                </option>
                <option key="대리" value="대리">
                    대리
                </option>
                <option key="과장" value="과장">
                    과장
                </option>
                <option key="차장" value="차장">
                    차장
                </option>
                <option key="부장" value="부장">
                    부장
                </option>
                <option key="팀장" value="팀장">
                    팀장
                </option>
          </select>
                </div>
                <button 
                    type="submit"
                    disabled={!isButtonEnabled} // 비활성화 상태 설정
                >
                    가입하기
                </button>
            </form>
            
        </div>
        <div className={styles.signuplink}>
              이미 계정이 있으신가요?<Link to="/login">로그인하기</Link>
            </div>
        </div>
    );
}

export default Signup