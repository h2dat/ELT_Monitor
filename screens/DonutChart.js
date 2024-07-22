import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Svg, G } from "react-native-svg";
import { pie } from "d3-shape";
import PieSlice from "./DonutSlice";

const Pie = ({ value, data, size, pieSize, onItemSelected }) => {
  const [arcs, setArcs] = useState(null);

  useEffect(() => {
    const calculatedArcs = pie()
      .value(item => item.number)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2)
      .sort(null)(data);
    setArcs(calculatedArcs);
  }, [data, pieSize]);

  return (
    arcs && (
      <View>
        <Svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size}`}>
          <G transform={`translate(${size / 2}, ${size / 2})`}>
            {data.map(({ color }, index) => (
              <PieSlice
                key={`pie_shape_${index}`}
                color={color}
                onSelected={onItemSelected(index)}
                arcData={arcs[index]}
                isActive={value.index === index}
              />
            ))}
          </G>
        </Svg>
      </View>
    )
  );
};

export default Pie;
