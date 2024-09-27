import React from 'react'
import styles from '../styles/List.module.css';
import statusComplete from '../styles/image/list/status-complete.svg';
import statusProgress from '../styles/image/list/status-progress.svg';
import statusPending from '../styles/image/list/status-pending.svg';

const List:React.FC = () => {
    const data = [
        { id: '01', name: 'SAS 라이센스 교체', manager: '김소연', status: '완료', deadline: '2024/09/01', statusColor: statusComplete },
        { id: '02', name: '주간보고서 작성', manager: '이규빈', status: '진행 중', deadline: '2024/09/15', statusColor: statusProgress },
        { id: "03", name: 'WAS 버전 업그레이드', manager: '변유석', status: '지연', deadline: '2024/09/07', statusColor: statusPending }
      ];

  return (
    <>
        <li className={styles.list}>
                        <p>이번 달 할 일</p>
                        <table className={styles.table}>
                        <thead>
                            <tr>
                            <th>No.</th>
                            <th>업무명</th>
                            <th>담당자</th>
                            <th>진행상태</th>
                            <th>마감일</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td><p>{item.name}</p></td>
                                <td>{item.manager}</td>
                                <td>
                                    <img src={item.statusColor} alt=""></img>
                                    {item.status}
                                </td>
                                <td>{item.deadline}</td>
                                <td><button>상세</button></td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </li>
    </>
  )
}

export default List