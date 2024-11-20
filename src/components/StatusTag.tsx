import { Tag, Tooltip } from 'antd';
import { ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

// 상태 태그 렌더링 함수
const StatusTag= (status:number, size?: 'small' | undefined) => {
  switch (status) {
    case 0:
      return (
        size==='small'?
        <Tooltip title="시작 전" placement="right" >
          <Tag
          icon={<ClockCircleOutlined />}
          color="#D1D1D1"
          style={{
            margin:0,
            padding: '4px 12px',
            borderRadius: '50px'            
          }}
        />
        </Tooltip>
        :<Tag
        icon={<ClockCircleOutlined />}
        color="#D1D1D1"
        style={{
          padding: '4px 12px',
          margin:0,
          borderRadius: '50px'            
        }}
      >
        시작 전
      </Tag>
      );
    case 1:
      return (
        size==='small'?
        <Tooltip title="진행 중" placement="right">
        <Tag
          icon={<SyncOutlined spin />}
          color="#006AFF"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            margin:0,
          }}
        />
        </Tooltip>
        :
        <Tag
          icon={<SyncOutlined spin />}
          color="#006AFF"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            margin:0,
          }}
        >
          진행 중
        </Tag>
      );
    case 2:
      return (
        size==='small'?
        <Tooltip title="완료" placement="right">
        <Tag
          icon={<CheckCircleOutlined />}
          color="#7FC043"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            margin:0,
          }}
        />
          
          </Tooltip>
        :<Tag
        icon={<CheckCircleOutlined />}
        color="#7FC043"
        style={{
          padding: '4px 12px',
          borderRadius: '50px',
          margin:0,
        }}
      >완료
      </Tag>
      );
    case 3:
      return (
        size==='small'?
        <Tooltip title="지연" placement="right">
        <Tag
          icon={<ExclamationCircleOutlined />}
          color="#F45959"
          style={{
            padding: '4px 12px',
            borderRadius: '50px',
            margin:0,
          }}
        />
        </Tooltip>
        :<Tag
        icon={<ExclamationCircleOutlined />}
        color="#F45959"
        style={{
          padding: '4px 12px',
          borderRadius: '50px',
          margin:0,
        }}
      >지연
      </Tag>
      );
    default:
      return null;
  }
};

export default StatusTag;