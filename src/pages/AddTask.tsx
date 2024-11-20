import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  Switch,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Avatar,
  FormInstance,
  Card
} from 'antd';
import { addTask } from '../api/task/addTask';
import { getUserByProjectId } from '../api/user/getUserByProjectId';
import { getProjectsByProjectId } from '../api/user/getProjectsByProjectId';
import dayjs from 'dayjs';
import styles from '../styles/pages/AddTask.module.css';
import '../styles/pages/AddTask.css';
import { useNavigate } from "react-router-dom";
import AddTaskIcon from '@mui/icons-material/AddTask';
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";


const { Option } = Select;



interface Project {
  
  projectId: string;
  name: string;
  description: string;

}

const AddTask: React.FC = () => {

  const [form] = Form.useForm(); //


  const [itoProcessId, setItoProcessId] = useState<string>('');
  const [projectId, setProjectId] = useState<string>('');

   const [userList, setUserList] = useState<User[]>([]);
  const [projectList, setProjectList] = useState<Project[]>([]); // 여러 프로젝트 지원을 위한 배열
  
  

  const [recurring, setRecurring] = useState<boolean>(false);
    const [frequencyType, setFrequencyType] = useState<string>('daily');
    const [hasEndDate, setHasEndDate] = useState(false);
    const [endDate, setEndDate] = useState<string>();
//   const [frequencyInterval, setFrequencyInterval] = useState<number>(1);
  const [dailyFrequencyInterval, setDailyFrequencyInterval] = useState<string>('1');
  const [weeklyFrequencyInterval, setWeeklyFrequencyInterval] = useState<string>('1');
  const [monthlyFrequencyInterval, setMonthlyFrequencyInterval] = useState<string>('1');
 
const [monthlyOption, setMonthlyOption] = useState<string>('dayOfMonth');
  const [monthlyDayOfMonth, setMonthlyDayOfMonth] = useState<number | null>(null); //옵션1)몇일
  const [monthlyWeekOfMonth, setMonthlyWeekOfMonth] = useState<number | null>(null); //옵션2-1)몇번째
  const [monthlyDayOfWeek, setMonthlyDayOfWeek] = useState<string>(''); //옵션2-2)몇요일

  const [yearlyOption, setYearlyOption]  = useState<string>('yearlyDayOfMonth')
  const [yearlyMonth, setYearlyMonth] = useState<number | null>(null); //공통)몇월
  const [yearlyDayOfMonth, setYearlyDayOfMonth] = useState<number | null>(null); //옵션1)몇일
  const [yearlyWeekOfMonth, setYearlyWeekOfMonth] = useState<number | null>(null); //옵션2-1)몇번째
  const [yearlyDayOfWeek, setYearlyDayOfWeek] = useState<string>(''); //옵션2-2)몇요일

    const navigate = useNavigate();

    interface User {
      userId: string;
      name: string;
      photo: string;
      // 필요에 따라 추가 속성 정의 가능
    }
    
    

  function getWeekOfMonthForSpecificDay(date:dayjs.Dayjs) {
    const dayOfWeek = date.day(); // 요일 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    let count = 0;
  
    // 해당 월의 첫 날부터 날짜를 증가시키며 해당 요일에 도달할 때마다 count 증가
    for (let d = 1; d <= date.date(); d++) {
        //const currentDay = dayjs(date.year(), date.month()+1, d);
        const currentDay = dayjs(date).set('date', d); // 날짜를 변경
        if (currentDay.day() === dayOfWeek) {
            count++;
        }
  
        if (currentDay.date() === date.date()) {
            break;
        }
    }
  
    return count;
  }
  
  function getDayOfWeek(date:dayjs.Dayjs) {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.day()];
  }


// 요일 매핑
const dayMapping: Record<number, string> = {
  0: 'SUNDAY',
  1: 'MONDAY',
  2: 'TUESDAY',
  3: 'WEDNESDAY',
  4: 'THURSDAY',
  5: 'FRIDAY',
  6: 'SATURDAY',
};

// // startDate와 dueDate 사이의 요일 계산 함수
// const getDaysBetweenDates = (startDate: string, dueDate: string): string[] => {
//   const start = dayjs(startDate);
//   const end = dayjs(dueDate);
//   const days: string[] = [];

//   for (let d = start; d.isBefore(end) || d.isSame(end); d = d.add(1, 'day')) {
//     const dayOfWeek = d.day(); // 요일 (0: 일요일 ~ 6: 토요일)
//     if (!days.includes(dayMapping[dayOfWeek])) {
//       days.push(dayMapping[dayOfWeek]);
//     }
//   }
//   console.log(days)
//   return days;
// };

 
  const [startDate, setStartDate] = useState<string>();
  const [dueDate, setDueDate] = useState<string>(); // 기본 종료일: 1주 후
  const [weeklyDay, setWeeklyDay] = useState<string[]>();
  
  const dayMappingKoToEn: Record<string, string> = {
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

  useEffect(() => {
    // 오늘의 요일을 계산하고 초기 상태로 설정
    const today = new Date().getDay(); // 0(일요일) ~ 6(토요일)
    const todayKoreanDay = numberToDay[today]; // 숫자를 한국어 요일로 변환
    const todayEnglishDay = dayMappingKoToEn[todayKoreanDay]; // 한국어 요일을 영어로 변환
    setWeeklyDay([todayEnglishDay]); // 오늘의 요일을 초기 상태로 설정


   const userInfo = sessionStorage.getItem("userInfo")
         ? JSON.parse(sessionStorage.getItem("userInfo") as string)
         : null;

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

   if (projectId) {
       const fetchUsers = async () => {
           try {
               const userListData = await getUserByProjectId(projectId);
               setUserList(userListData || []);
           } catch (error) {
               console.error("Error fetching users:", error);
           }
       };
       fetchUsers();
   }
}, [projectId]);



  const handleFrequencyOptions = () => {
    switch (frequencyType) {
      case 'daily':
        return (
          <>
  {/* "일 마다" 입력 필드 한 줄로 배치 */}
  {/* "일 마다" 입력 필드 한 줄로 배치 */}
  <Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Form.Item
        
        initialValue={1}
        noStyle
        rules={[{ required: true, message: '일 수를 입력하세요.' }]}
      >
        <Input
          size="large"
          type="number"
          min={1}
          placeholder="1"
          value={dailyFrequencyInterval}
          onChange={(e)=>setDailyFrequencyInterval(e.target.value)}
          style={{ width: '100px' }}
        />
      </Form.Item>
      <label style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>일 마다</label>
    </div>
  </Form.Item>

          {/* 종료일 옵션과 DatePicker 한 줄로 배치 */}
          <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }}
>
  {/* 종료일 라디오 그룹 */}
  <Form.Item
    name="hasEndDate"
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <Radio.Group
      value={hasEndDate}
      onChange={(e) => setHasEndDate(e.target.value)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Radio value={false} style={{ whiteSpace: 'nowrap' }}>
        종료일 없음
      </Radio>
      <Radio value={true} style={{ whiteSpace: 'nowrap' }}>
        종료일 있음
      </Radio>
    </Radio.Group>
  </Form.Item>

  {/* 종료일 DatePicker */}
  <Form.Item
    noStyle
    rules={[{ required: true, message: '종료일을 선택하세요.' }]}
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <DatePicker
      size="large"
      placeholder="종료일 선택"
      style={{
        width: '100%',
        opacity: hasEndDate ? 1 : 0, // 보이거나 투명하게
        visibility: hasEndDate ? 'visible' : 'hidden', // 보이거나 숨김
        transition: 'opacity 0.3s ease', // 부드러운 전환
      }}
      onChange={(date: dayjs.Dayjs | null, dateString: string | string[]) => {
        if (Array.isArray(dateString)) {
          console.error('Unexpected array value in dateString:', dateString);
          return;
        }
        if (date) {
          setEndDate(dateString); // 상태 업데이트
          console.log('Updated dueDate:', dateString); // 확인용 로그
        }
      }}
    />
  </Form.Item>
</div>


</>


        );
      case 'weekly':
        return (
          <>
          {/* "주 마다" 입력 필드 한 줄로 배치 */}
  <Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    
      <Form.Item
        initialValue={1}
        noStyle
        rules={[{ required: true, message: '주 수를 입력하세요.' }]}
      >
        <Input
          size="large"
          type="number"
          min={1}
          placeholder="1"
          style={{ width: '100px' }}
          value={weeklyFrequencyInterval}
          onChange={(e)=>setWeeklyFrequencyInterval(e.target.value)}
        />
      </Form.Item>
      <label style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>주 마다</label>
    </div>
  </Form.Item>
      
  <Form.Item
      name="weeklyDay"
      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}

    >
      <Checkbox.Group
        style={{
          width: '100%', // 부모 너비에 맞추기
          display: 'flex', // 플렉스 박스 사용
          justifyContent: 'space-between', // 옵션 간 간격 균등 분배
          flexWrap: 'nowrap', // 줄 바꿈 방지
        }}
        options={[
          { label: '일', value: 'SUNDAY' },
          { label: '월', value: 'MONDAY' },
          { label: '화', value: 'TUESDAY' },
          { label: '수', value: 'WEDNESDAY' },
          { label: '목', value: 'THURSDAY' },
          { label: '금', value: 'FRIDAY' },
          { label: '토', value: 'SATURDAY' },
        ]}

      />
    </Form.Item>

          {/* 종료일 옵션과 DatePicker 한 줄로 배치 */}
          <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }}
>
  {/* 종료일 라디오 그룹 */}
  <Form.Item
    name="hasEndDate"
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <Radio.Group
      value={hasEndDate}
      onChange={(e) => setHasEndDate(e.target.value)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Radio value={false} style={{ whiteSpace: 'nowrap' }}>
        종료일 없음
      </Radio>
      <Radio value={true} style={{ whiteSpace: 'nowrap' }}>
        종료일 있음
      </Radio>
    </Radio.Group>
  </Form.Item>

  {/* 종료일 DatePicker */}
  <Form.Item
    noStyle
    rules={[{ required: true, message: '종료일을 선택하세요.' }]}
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <DatePicker
      size="large"
      placeholder="종료일 선택"
      style={{
        width: '100%',
        opacity: hasEndDate ? 1 : 0, // 보이거나 투명하게
        visibility: hasEndDate ? 'visible' : 'hidden', // 보이거나 숨김
        transition: 'opacity 0.3s ease', // 부드러운 전환
      }}
      onChange={(date: dayjs.Dayjs | null, dateString: string | string[]) => {
        if (Array.isArray(dateString)) {
          console.error('Unexpected array value in dateString:', dateString);
          return;
        }
        if (date) {
          setEndDate(dateString); // 상태 업데이트
          console.log('Updated dueDate:', dateString); // 확인용 로그
        }
      }}
    />
  </Form.Item>

</div>

          </>
        );
      case 'monthly':
        return (
          <>
          <Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
    
      <Form.Item
        initialValue={1}
        noStyle
        rules={[{ required: true, message: '개월 수를 입력하세요.' }]}
      >
        <Input
          size="large"
          type="number"
          min={1}
          placeholder="1"
          style={{ width: '100px' }}
          value={monthlyFrequencyInterval}
          onChange={(e)=>setMonthlyFrequencyInterval(e.target.value)}
        />
      </Form.Item>
      <label style={{ marginBottom: 0, whiteSpace: 'nowrap' }}>개월 마다</label>
    </div>
  </Form.Item>
          <Form.Item style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px', // 적절한 간격 추가
    }} >
            <Radio.Group onChange={(e) => setMonthlyOption((e.target.value))}
            value={monthlyOption} style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              gap: '16px', // 버튼 간 간격 추가
            }}>
              <Space direction="horizontal">
                <Radio value="dayOfMonth" style={{
          flex: 1,
          whiteSpace: 'nowrap',
          display: 'flex',
          textAlign: 'center',
        }}>{`${dayjs(startDate).date()}일`}</Radio>
                <Radio value="weekOfMonth" style={{
          flex: 1,
          whiteSpace: 'nowrap',
          display: 'flex',
          textAlign: 'center',
        }}>{`${getWeekOfMonthForSpecificDay(dayjs(startDate))}번째 ${getDayOfWeek(dayjs(startDate))}요일`}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          {/* 종료일 옵션과 DatePicker 한 줄로 배치 */}
          <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }}
>
  {/* 종료일 라디오 그룹 */}
  <Form.Item
    name="hasEndDate"
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <Radio.Group
      value={hasEndDate}
      onChange={(e) => setHasEndDate(e.target.value)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Radio value={false} style={{ whiteSpace: 'nowrap' }}>
        종료일 없음
      </Radio>
      <Radio value={true} style={{ whiteSpace: 'nowrap' }}>
        종료일 있음
      </Radio>
    </Radio.Group>
  </Form.Item>

  {/* 종료일 DatePicker */}
  <Form.Item
    noStyle
    rules={[{ required: true, message: '종료일을 선택하세요.' }]}
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <DatePicker
      size="large"
      placeholder="종료일 선택"
      onChange={(date: dayjs.Dayjs | null, dateString: string | string[]) => {
        if (Array.isArray(dateString)) {
          console.error('Unexpected array value in dateString:', dateString);
          return;
        }
        if (date) {
          setEndDate(dateString); // 상태 업데이트
          console.log('Updated dueDate:', dateString); // 확인용 로그
        }
      }}
      style={{
        width: '100%',
        opacity: hasEndDate ? 1 : 0, // 보이거나 투명하게
        visibility: hasEndDate ? 'visible' : 'hidden', // 보이거나 숨김
        transition: 'opacity 0.3s ease', // 부드러운 전환
      }}
    />
  </Form.Item>
</div>

          </>
        );
      case 'yearly':
        return (
          <>
          {/* yearlyOption 선택 */}
          
  <Form.Item
    //name="yearlyOption"
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '16px', // 적절한 간격 추가
    }}
  >
    <Radio.Group
      value={yearlyOption}
      onChange={(e) => setYearlyOption(e.target.value)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        gap: '16px', // 버튼 간 간격 추가
      }}
    >
      <Radio
        value="yearlyDayOfMonth"
        style={{
          flex: 1,
          whiteSpace: 'nowrap',
          display: 'flex',
          textAlign: 'center',
        }}
      >
        {`${dayjs(startDate).month() + 1}월 ${dayjs(startDate).date()}일`}
      </Radio>
      <Radio
        value="yearlyWeekOfMonth"
        style={{
          flex: 1,
          whiteSpace: 'nowrap',
          display: 'flex',
          textAlign: 'center',
        }}
      >
        {`${dayjs(startDate).month() + 1}월 ${getWeekOfMonthForSpecificDay(
          dayjs(startDate)
        )}번째 ${getDayOfWeek(dayjs(startDate))}요일`}
      </Radio>
    </Radio.Group>
  </Form.Item>

        
          {/* 종료일 옵션 */}
          <div
  style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  }}
>
  {/* 종료일 라디오 그룹 */}
  <Form.Item
    name="hasEndDate"
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <Radio.Group
      value={hasEndDate}
      onChange={(e) => setHasEndDate(e.target.value)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Radio value={false} style={{ whiteSpace: 'nowrap' }}>
        종료일 없음
      </Radio>
      <Radio value={true} style={{ whiteSpace: 'nowrap' }}>
        종료일 있음
      </Radio>
    </Radio.Group>
  </Form.Item>

  {/* 종료일 DatePicker */}
  <Form.Item
    noStyle
    rules={[{ required: true, message: '종료일을 선택하세요.' }]}
    style={{
      flex: 1,
      marginBottom: 0,
    }}
  >
    <DatePicker
      size="large"
      placeholder="종료일 선택"
      onChange={(date: dayjs.Dayjs | null, dateString: string | string[]) => {
        if (Array.isArray(dateString)) {
          console.error('Unexpected array value in dateString:', dateString);
          return;
        }
        if (date) {
          setEndDate(dateString); // 상태 업데이트
          console.log('Updated dueDate:', dateString); // 확인용 로그
        }
      }}
      style={{
        width: '100%',
        opacity: hasEndDate ? 1 : 0, // 보이거나 투명하게
        visibility: hasEndDate ? 'visible' : 'hidden', // 보이거나 숨김
        transition: 'opacity 0.3s ease', // 부드러운 전환
      }}
    />
  </Form.Item>
</div>

        </>
        
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (values: any) => {
    const userInfo = sessionStorage.getItem("userInfo")
      ? JSON.parse(sessionStorage.getItem("userInfo") as string)
      : null;

      
      // 기본 필수 필드 추가
      let taskData: Record<string, any> = {
        ...values,
        startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
        dueDate: dayjs(values.dueDate).format('YYYY-MM-DD'),
        hasEndDate: values.hasEndDate || false, // 기본적으로 포함
        createdBy: userInfo.userId,
        createdDate: dayjs().format('YYYY-MM-DD'),
        status: 0
      };
  
      
      // 반복 여부 처리
      if (values.recurring) {
        taskData = {
          ...taskData,
          recurring: true,
          frequencyType: values.frequencyType || 'daily', // 기본값: daily
          //frequencyInterval: Number(values.dailyInterval) || 1, // 기본값: dailyInterval
        };
  
        if (values.frequencyType === 'daily') {
          taskData.frequencyInterval = Number(dailyFrequencyInterval) || 1; // 주기
        }
        else if (values.frequencyType === 'weekly') {
          taskData.frequencyInterval = Number(weeklyFrequencyInterval) || 1; // 주기
          taskData.weeklyDay = values.weeklyDay || []; // 선택된 요일
        } else if (values.frequencyType === 'monthly') {
          taskData.frequencyInterval = Number(monthlyFrequencyInterval) || 1;
          
          if (monthlyOption === 'dayOfMonth') {
            taskData.monthlyDayOfMonth = dayjs(values.startDate).date();
            //taskData.yearlyDayOfMonth = dayjs(values.startDate).date();
          } else if (monthlyOption === 'weekOfMonth') {
            taskData.monthlyWeekOfMonth = getWeekOfMonthForSpecificDay(dayjs(values.startDate))
            taskData.monthlyDayOfWeek = dayMappingKoToEn[getDayOfWeek(dayjs(values.startDate))]
          }
        
        } else if (values.frequencyType === 'yearly') {
          if (yearlyOption === 'yearlyDayOfMonth') {
            taskData.yearlyMonth = dayjs(values.startDate).month() + 1;
            taskData.yearlyDayOfMonth = dayjs(values.startDate).date();
          } else if (yearlyOption === 'yearlyWeekOfMonth') {
            taskData.yearlyMonth = dayjs(values.startDate).month() + 1;
            taskData.yearlyWeekOfMonth = getWeekOfMonthForSpecificDay(dayjs(values.startDate));
            taskData.yearlyDayOfWeek = dayMappingKoToEn[getDayOfWeek(dayjs(values.startDate))];
          }
        }
        // 종료일 처리
        if (values.hasEndDate) {
          taskData.endDate = dayjs(endDate).format('YYYY-MM-DD');
        }
      } else {
        taskData.recurring = false;
      }
  
      

  
      console.log('Task Data:', taskData);
    try {

      // 업무 등록 API 호출
      const response = await addTask(taskData);
            
      console.log(response);

      if (response.code===201) {
          toast.success(`업무를 등록하였습니다!`);
          navigate('/');

      } else {
          // 실패 시 에러 메시지 표시
          toast.error(response.message || '업무 등록에 실패했습니다.');
      }
    } catch (error) {
      toast.error('서버와 통신 중 오류가 발생했습니다.');
    }
  };
  

  return (
    <div className={styles.container}>
      <Title level={2} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <AddTaskIcon style={{ width: '32px', height: '32px' ,color:'#00844A'}} />
  업무 생성
</Title>

      
        <Form
        form={form}
        layout="horizontal"
        onFinish={handleSubmit}
        initialValues={{
          startDate: dayjs(),
          dueDate: dayjs(),
          frequencyType: 'daily',
          weeklyDay: [dayMapping[dayjs().day()]],
          isRecurring:false,
          hasEndDate:hasEndDate,
        }}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign="left" // 레이블 왼쪽 정렬
        style={{ margin: '0 auto', textAlign: 'left' }}
      >

        {/* 제목 */}
        <Form.Item
          label="제목"
          name="taskName"
          rules={[{ required: true, message: '제목을 입력하세요.' }]}
        >
          <Input placeholder="제목을 입력하세요" size="large"/>
        </Form.Item>

      {/* 시작일 및 종료일 */}
      <Form.Item
  label="기간"
  required
  style={{ marginBottom: '16px' }}
>
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'space-between',
    marginBottom: '16px',
  }}
>
  {/* 시작일 */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexDirection: 'row',
      alignContent: 'center',
      position: 'relative',
    }}
  >
    <Form.Item
      name="startDate"
      className="custom-form-item"
      rules={[{ required: true, message: '시작일을 선택하세요.' }]}
      style={{
        marginBottom: 0,
        flex: 1,
        position: 'relative', // 에러 메시지 위치 조정
      }}
    >
      <DatePicker
        size="large"
        placeholder="시작일 선택"
        style={{ width: '100%' }}
        onChange={(date: dayjs.Dayjs | null, dateString: string | string[]) => {
          if (Array.isArray(dateString)) {
            console.error('Unexpected array value in dateString:', dateString);
            return;
          }
          if (date) {
            setStartDate(dateString); // 상태 업데이트
            console.log('Updated dueDate:', dateString); // 확인용 로그
          }
        }}
      />
    </Form.Item>
    <span>~</span>
    {/* 종료일 */}
    <Form.Item
      className="custom-form-item"
      name="dueDate"
      rules={[
        { required: true, message: '마감일을 선택하세요.' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || !getFieldValue('startDate')) {
              return Promise.resolve();
            }
            if (value.isBefore(getFieldValue('startDate'))) {
              return Promise.reject(
                new Error('종료일은 시작일 이후여야 합니다.')
              );
            }
            return Promise.resolve();
          },
        }),
      ]}
      style={{
        marginBottom: 0,
        flex: 1,
        position: 'relative', // 에러 메시지 위치 조정
      }}
    >
      <DatePicker
        size="large"
        placeholder="마감일 선택"
        style={{ width: '100%' }}
        onChange={(date: dayjs.Dayjs | null, dateString: string | string[]) => {
          if (Array.isArray(dateString)) {
            console.error('Unexpected array value in dateString:', dateString);
            return;
          }
          if (date) {
            setDueDate(dateString); // 상태 업데이트
            console.log('Updated dueDate:', dateString); // 확인용 로그
          }
        }}
      />
    </Form.Item>
  </div>

  {/* 반복 여부 */}
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <span>반복 여부:</span>
    <Form.Item name="recurring" style={{ marginBottom: 0 }} valuePropName="checked">
      <Switch onChange={(checked) => setRecurring(checked)} />
    </Form.Item>
  </div>
</div>


</Form.Item>

    


    {/* 반복 설정 */}
    {recurring && (
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        padding:'0 50px'
    }}>
      <Card style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '16px',  
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        marginBottom:'40px'
        
    }}>
      <Form.Item
        label=""
        name="frequencyType"
        rules={[{ required: true, message: '반복 유형을 선택하세요.' }]}
        style={{ width: '100%', display:'flex', justifyContent: 'center',marginBottom:'0'}}
      >
          
          <Radio.Group
            onChange={(e) => setFrequencyType((e.target.value))}
            value={frequencyType}
            style={{
              width: '100%',
              display: 'flex', // 버튼들을 한 줄로 정렬
              marginBottom:'20px'
            }}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button  style={{ flex: '1', textAlign: 'center', whiteSpace:'nowrap' }} value="daily">매일</Radio.Button>
            <Radio.Button  style={{ flex: '1', textAlign: 'center', whiteSpace:'nowrap' }} value="weekly">매주</Radio.Button>
            <Radio.Button  style={{ flex: '1', textAlign: 'center', whiteSpace:'nowrap' }} value="monthly">매월</Radio.Button>
            <Radio.Button  style={{ flex: '1', textAlign: 'center', whiteSpace:'nowrap' }} value="yearly">매년</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {handleFrequencyOptions()}
      </Card>
      </div>
    )}

{/* 프로세스 */}
<Form.Item
  label="ITO 프로세스"
  name="itoProcessId"
  rules={[{ required: true, message: '프로세스를 선택하세요.' }]}
>
  <Select
    placeholder="프로세스를 선택하세요"
    size="large"
    value={itoProcessId}
    onChange={(value:string) => setItoProcessId(value)}
    allowClear
  >
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
          <Select
          size="large"
            placeholder="프로젝트를 선택하세요"
            onChange={(value:string)=>setProjectId(value)}
          >
            {projectList.map((project: any) => (
              <Option key={project.projectId} value={project.projectId}>
                {project.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* 담당자 */}
        <Form.Item
          label="담당자"
          name="assigneeIds"
          rules={[{ required: true, message: '담당자를 선택하세요.' }]}
        >
          <Select
          size="large"
      mode="multiple"
      style={{ width: '100%' }}
      placeholder="담당자를 선택하세요."

    >
      {userList.map((user) => (
        <Option key={user.userId} value={user.userId}>
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
              등록
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()} size="large">
              취소
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTask;
