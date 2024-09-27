import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from '../styles/Graph.module.css';

const Graph:React.FC = () => {
    const data = [
        { month: '3월', value: 60, value2: 40 },
        { month: '4월', value: 30, value2: 70 },
        { month: '5월', value: 50, value2: 50 },
        { month: '6월', value: 80, value2: 20 },
        { month: '7월', value: 60, value2: 40 },
        { month: '8월', value: 70, value2: 30 },
      ];
      
      const CustomizedDot = (props:any) => {
        const { cx, cy, stroke, payload, value } = props;
      
        if (value > 50) {
          return (
            <svg x={cx - 5} y={cy - 5} width={10} height={10} fill={stroke} viewBox="0 0 1024 1024">
              <circle cx="5" cy="5" r="5" strokeWidth="2" fill={stroke} />
            </svg>
          );
        }
      
        return null;
      };
  return (
    <>
        <li className={styles.graph}>
                        <p>진행률</p>
                        
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart data={data}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" strokeDasharray="3 4">
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                    </Area>
                                    <Area type="monotone" dataKey="value2" stroke="#82ca9d" />
                                </AreaChart>
                            </ResponsiveContainer>
                        
                    </li>
    </>
  )
}

export default Graph