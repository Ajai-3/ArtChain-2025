import React from "react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2 rounded shadow-lg text-popover-foreground">
        <p className="font-semibold mb-1 text-xs">{label ? label : payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p
            key={index}
            className="text-xs"
            style={{ color: entry.color || entry.fill || entry.stroke }}
          >
            {entry.name || entry.dataKey}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
