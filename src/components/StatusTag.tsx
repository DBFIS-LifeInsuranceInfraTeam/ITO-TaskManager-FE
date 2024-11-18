import { Tag } from 'antd';
import { ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// 상태 태그 렌더링 함수
const StatusTag= (status:number, size?: 'small' | undefined) => {
  switch (status) {
    case 0:
      return (
        size==='small'?
        <Tag
          icon={<ClockCircleOutlined />}
          color="#D1D1D1"
          style={{
            padding: '4px 12px',
            borderRadius: '50px'            
          }}
        >
          
        </Tag>
        :<Tag
        icon={<ClockCircleOutlined />}
        color="#D1D1D1"
        style={{
          padding: '4px 12px',
          borderRadius: '50px'            
        }}
      >
        시작 전
      </Tag>
      );
    case 1:
      return (
        size==='small'?
        <Tag
          icon={<SyncOutlined spin />}
          color="#006AFF"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            
          }}
        >
        </Tag>
        :
        <Tag
          icon={<SyncOutlined spin />}
          color="#006AFF"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            
          }}
        >
          진행 중
        </Tag>
      );
    case 2:
      return (
        size==='small'?
        <Tag
          icon={<CheckCircleOutlined />}
          color="#7FC043"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            
          }}
        >
          
        </Tag>
        :<Tag
        icon={<CheckCircleOutlined />}
        color="#7FC043"
        style={{
          padding: '4px 12px',
          borderRadius: '50px',
          
        }}
      >완료
      </Tag>
      );
    case 3:
      return (
        size==='small'?
        <Tag
          icon={<ExclamationCircleOutlined />}
          color="#F45959"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            
          }}
        >
          
        </Tag>
        :<Tag
        icon={<ExclamationCircleOutlined />}
        color="#F45959"
        style={{
          padding: '4px 12px',
          borderRadius: '50px',
          
        }}
      >
      </Tag>
      );
    default:
      return null;
  }
};

export default StatusTag;