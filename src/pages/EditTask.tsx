import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Select, Button, Checkbox, Avatar, Space, Tag, Switch, Radio,FormInstance } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarOutlined, AppstoreAddOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styles from '../styles/pages/AddTask.module.css';
import { getUserByProjectId } from '../api/user/getUserByProjectId';
import { getProjectsByProjectId } from '../api/user/getProjectsByProjectId';
import Title from "antd/es/typography/Title";
import { updateTask } from '../api/task/updateTask';
import { toast } from 'react-toastify';


const { Option } = Select;  // Option을 여기서 가져옵니다.

interface Assignee {
  assigneeId: string;
  assigneeName: string;
  assigneeProfile: string;
}
interface Task {
  taskId: string;
  taskName: string;
  status: number;
  startDate: string;
  dueDate: string;
  projectId: string;
  itoProcessId: string;
  description: string;
  isRecurring: boolean;
  assignees: Assignee[];
}

interface FormFields {
  taskName: string;
  itoProcessId: string;
  projectId: string;
  startDate: dayjs.Dayjs;
  dueDate: dayjs.Dayjs;
  assigneeIds: string[];
  description: string;
}

  
  interface Project {
    
    projectId: string;
    name: string;
    description: string;
    smtpUrl?: string;
    smtpId?: string;
    smtpPw?: string;
  }

const EditTask = () => {
  const location = useLocation();


  // location.state에서 task를 가져오되 기본값 설정
  const { task } = location.state as { task: Task }; // task 데이터 추출

  

  // 기본값 할당
  const defaultTask: Task = {
      taskId:'',
      taskName: '',
      status: 0,
      startDate: '',
      dueDate: '',
      projectId:'',
      itoProcessId: '',
      description: '',
      isRecurring: false,
      assignees: [{assigneeId:'',assigneeName:'',assigneeProfile:''}],
  };

  const currentTask = task || defaultTask;

  console.log('Received Task:', currentTask); // 전달된 데이터 확인
  const [form] = Form.useForm<FormFields>();

  // const [taskName, setTaskName] = useState<string>('');
  // const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  // const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  // const [processId, setProcessId] = useState<string>('');
  // const [projectId, setProjectId] = useState<string>('');
  // const [assigneeId, setAssigneeId] = useState<string>('');
  // const [description, setDescription] = useState<string>('');
    
  
  const [projectId, setProjectId] = useState<string>(task.projectId);
  // // userList의 타입을 User[]로 설정
  const [userList, setUserList] = useState<User[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]); // 여러 프로젝트 지원을 위한 배열
  


  // const [isRecurring, setIsRecurring] = useState<boolean>(false);
  // const [frequencyType, setFrequencyType] = useState<string>('daily');
  // const [hasEndDate, setHasEndDate] = useState(false);
  // const [frequencyInterval, setFrequencyInterval] = useState<number>(1);
  // const [dailyFrequencyInterval, setDailyFrequencyInterval] = useState<string>('1');
  // const [weeklyFrequencyInterval, setWeeklyFrequencyInterval] = useState<string>('1');
  // const [monthlyFrequencyInterval, setMonthlyFrequencyInterval] = useState<string>('1');
  // const [weeklyDay, setWeeklyDay] = useState<string[]>([]);
  // const [monthlyDayOfMonth, setMonthlyDayOfMonth] = useState<number | null>(null);
  // const [monthlyWeekOfMonth, setMonthlyWeekOfMonth] = useState<number | null>(null);
  // const [monthlyDayOfWeek, setMonthlyDayOfWeek] = useState<string>('');
  // const [yearlyMonth, setYearlyMonth] = useState<number | null>(null);
  // const [yearlyDayOfMonth, setYearlyDayOfMonth] = useState<number | null>(null);
  // const [yearlyWeekOfMonth, setYearlyWeekOfMonth] = useState<number | null>(null);
  // const [yearlyDayOfWeek, setYearlyDayOfWeek] = useState<string>('');
  
  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        taskName: task.taskName,
        itoProcessId: task.itoProcessId,
        projectId: task.projectId,
        startDate: dayjs(task.startDate),
        dueDate: dayjs(task.dueDate),
        assigneeIds: task.assignees.map((assignee) => assignee.assigneeId), // assigneeId만 추출
        description: task.description,
      });
  
      const fetchProjectList = async () => {
        try {
          const resProjectList = await getProjectsByProjectId([task.projectId]);
          setProjectList(resProjectList);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      fetchProjectList();
  
      const fetchUsers = async () => {
        try {
          const userListData = await getUserByProjectId(task.projectId);
          console.log("Fetched userList:", userListData);
          setUserList(userListData || []);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
      fetchUsers();
    }
  }, [task, form, projectId]);
  
  
  

  const handleSubmit = async (values: any) => {
    

    let updateData: Record<string, any> = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      dueDate: values.dueDate.format('YYYY-MM-DD'),
    };

    console.log('Updated task:', updateData);
    console.log('taskId:', task.taskId);

    try {
      const response = await updateTask(task.taskId,updateData);
      console.log(response)
      if (response.code === 200){
        //console.log("업무 수정 완료:", response);
        toast.success(`${response.message}`)
        navigate(-1); // 성공 시 이전 페이지로 이동
      }else{
        toast.error('업무 수정에 실패했습니다.')
      }
      
  } catch (error) {
      console.error("업무 수정 중 오류:", error);
  }

    // 수정된 데이터를 서버로 전송하거나 상태 업데이트 등을 처리할 수 있습니다.
  };

  interface User {
    userId: string;
    name: string;
    photo: string;
    // 필요에 따라 추가 속성 정의 가능
  }
  


  const dayMapping: Record<string, string> = {
    '일': 'SUNDAY',
    '월': 'MONDAY',
    '화': 'TUESDAY',
    '수': 'WEDNESDAY',
    '목': 'THURSDAY',
    '금': 'FRIDAY',
    '토': 'SATURDAY',
};

const numberToDay: Record<number, string> = {
    0: '일',
    1: '월',
    2: '화',
    3: '수',
    4: '목',
    5: '금',
    6: '토',
};


const fetchProjects = async () => {
  try {
    const userInfo = sessionStorage.getItem('userInfo')
      ? JSON.parse(sessionStorage.getItem('userInfo') as string)
      : null;
    const resProjectList = await getProjectsByProjectId(userInfo.projectId);
    setProjectList(resProjectList);
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const handleChange = (value: string[]) => {
    console.log('Selected users:', value);
  };

  const handleProjectChange = (value: string) => {
    fetchUsers(value);
  };

const fetchUsers = async (projectId: string) => {
  try {
    const resUserList = await getUserByProjectId(projectId);
    setUserList(resUserList || []);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const navigate = useNavigate(); // navigate 함수 사용

  const handleEditCancel = () => {
    navigate(-1); // 이전 화면으로 이동
  };

  return (
    <div className={styles.container}>
      <Title level={2} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <EditOutlined style={{ width: '32px', height: '32px' ,color:'#00844A'}} />
  업무 수정
</Title>
      
<Form
  form={form}
  layout="horizontal"
  onFinish={handleSubmit}
  labelCol={{ span: 4 }}
  wrapperCol={{ span: 20 }}
  labelAlign="left"
  style={{ margin: '0 auto', textAlign: 'left' }}

  // initialValues={{
  //   taskName: task?.taskName,
  //   processId: task?.itoProcessId,
  //   startDate: task?.startDate ? dayjs(task.startDate) : null,
  //   dueDate: task?.dueDate ? dayjs(task.dueDate) : null,
  //   projectId: task?.projectId,
  //   assignees: task?.assignees.map((assignee) => ({
  //     userId: assignee.assigneeId,
  //     name: assignee.assigneeName,
  //     photo: assignee.assigneeProfile,
  //   })),
  //   description: task?.description,
  // }}
>
  {/* 제목 */}
  <Form.Item
    label="제목"
    name="taskName" // 반드시 taskName과 일치
    rules={[{ required: true, message: "제목을 입력하세요." }]}
  >
    <Input placeholder="제목을 입력하세요" size="large"/>
  </Form.Item>

  {/* 기간 */}
  <Form.Item
    label="기간"
    required
    style={{ marginBottom: '16px' }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Form.Item
        name="startDate"
        style={{ marginBottom: 0 }}
        rules={[{ required: true, message: '시작일을 선택하세요.' }]}
      >
        <DatePicker placeholder="시작일 선택" size="large"/>
      </Form.Item>
      <span>~</span>
      <Form.Item
        name="dueDate"
        style={{ marginBottom: 0 }}
        rules={[{ required: true, message: '마감일을 선택하세요.' }]}
      >
        <DatePicker placeholder="마감일 선택" size="large"/>
      </Form.Item>
    </div>
  </Form.Item>

  {/* ITO 프로세스 */}
  <Form.Item
    label="ITO 프로세스"
    name="itoProcessId"
    rules={[{ required: true, message: '프로세스를 선택하세요.' }]}
  >
    <Select placeholder="프로세스를 선택하세요" size="large">
      <Select.Option value="1">리포팅</Select.Option>
      <Select.Option value="2">보안</Select.Option>
      <Select.Option value="3">용량</Select.Option>
      <Select.Option value="4">변경</Select.Option>
      <Select.Option value="5">가용성</Select.Option>
      <Select.Option value="6">감사지원</Select.Option>
      <Select.Option value="7">구성</Select.Option>
      <Select.Option value="8">배포</Select.Option>
    </Select>
  </Form.Item>

  {/* 프로젝트 */}
  <Form.Item
    label="프로젝트"
    name="projectId"
    rules={[{ required: true, message: '프로젝트를 선택하세요.' }]}
  >
    <Select placeholder="프로젝트를 선택하세요" onChange={(value:string)=>setProjectId(value)} size="large">
      {projectList.map((project: any) => (
        <Select.Option key={project.projectId} value={project.projectId}>
          {project.name}
        </Select.Option>
      ))}
    </Select>
  </Form.Item>

  {/* 담당자 */}
  {/* <Form.Item
  label="담당자"
  name="assignees"
  rules={[{ required: true, message: '담당자를 선택하세요.' }]}
>
  <Select
    mode="multiple"
    placeholder="담당자를 선택하세요"
    size="large"
    optionLabelProp="label"
    disabled={userList.length === 0} // userList 로딩 중에는 비활성화
  >
    {userList.map((user) => (
      <Option key={user.userId} value={user.userId} label={user.name}>
        <Space>
          <Avatar src={`http://localhost:8080/${user.photo}`} />
          {user.name}
        </Space>
      </Option>
    ))}
  </Select>
</Form.Item> */}
<Form.Item
  label="담당자"
  name="assigneeIds"
  rules={[{ required: true, message: '담당자를 선택하세요.' }]}
>
  <Select
    mode="multiple"
    placeholder="담당자를 선택하세요"
    size="large"
    optionLabelProp="label"
    tagRender={({ label, value, onClose }) => {
      const selectedUser = userList.find(user => user.userId === value);
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.06)',
            border: 'var(--ant-line-width) var(--ant-line-type) var(--ant-select-multiple-item-border-color)',
            borderRadius: '5px',
            padding: '4px 8px',
            marginRight: '5px',
          }}
        >
          <Avatar src={`/${selectedUser?.photo}`} size="small" />
          <span style={{ marginLeft: '8px', marginRight: '8px' }}>{label}</span>
          <span
            style={{
              cursor: 'pointer',
              color: `rgba(0,0,0,0.45)`,
              fontSize: '12px',
            }}
            onClick={onClose}
          >
            ✖
          </span>
        </div>
      );
    }}
  >
    {userList.map((user) => (
      <Option key={user.userId} value={user.userId} label={user.name}>
        <Space>
          <Avatar src={`/${user.photo}`} />
          {user.name}
        </Space>
      </Option>
    ))}
  </Select>
</Form.Item>

  {/* 설명 */}
  <Form.Item
    label="내용"
    name="description"
    rules={[{ required: true, message: '내용을 입력하세요.' }]}
  >
    <Input.TextArea rows={4} placeholder="내용을 입력하세요" size="large"/>
  </Form.Item>

  {/* 버튼 */}
  <Form.Item>
    <Space>
      <Button type="primary" htmlType="submit" size="large">
        수정
      </Button>
      <Button htmlType="button" onClick={handleEditCancel} size="large">
        취소
      </Button>
    </Space>
  </Form.Item>
</Form>
    </div>
  );
};

export default EditTask;
