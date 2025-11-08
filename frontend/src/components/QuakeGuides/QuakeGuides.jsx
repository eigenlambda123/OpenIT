import {
  Flex,
  Heading,
} from '@chakra-ui/react';
import GuideEntry from './GuideEntry';
import quakeGuides from './guides';
import { useEffect, useState } from 'react';

function QuakeGuides() {
  const [doRandoms, setDoRandoms] = useState([]);
  const [dontRandoms, setDontRandoms] = useState([]);

  useEffect(() => {
    const doGuides = quakeGuides.filter(g => g.type === "do");
    const dontGuides = quakeGuides.filter(g => g.type === "dont");

    const selectedDoRandoms = [];
    const selectedDontRandoms = [];

    for (let i = 0; i < 3; i++) {
      const doRandomIndex = Math.floor(Math.random() * doGuides.length);
      const doRandom = doGuides[doRandomIndex];

      const dontRandomIndex = Math.floor(Math.random() * dontGuides.length);
      const dontRandom = dontGuides[dontRandomIndex];

      if (
        selectedDoRandoms.some(item => item.heading === doRandom.heading) ||
        selectedDontRandoms.some(item => item.heading === dontRandom.heading)
      ) {
        i--;
        continue;
      }

      selectedDoRandoms.push(doRandom);
      selectedDontRandoms.push(dontRandom);
    }
    
    setTimeout(() => {
      setDoRandoms(selectedDoRandoms);
      setDontRandoms(selectedDontRandoms);
    }, 3000);
    
  }, []);

  return (
    <>
      <Flex direction="column" gap="10px">
        <Heading size={['sm', 'md']}>What To Do</Heading>
        <Flex direction="column">
          {doRandoms.map((data) => (
            <GuideEntry key={data.heading} guideData={data} />
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" gap="10px">
        <Heading size={['sm', 'md']}>What Not To Do</Heading>
        <Flex direction="column">
          {dontRandoms.map(data => (
            <GuideEntry key={data.heading} guideData={data} />
          ))}
        </Flex>
      </Flex>
    </>
  );
}

export default QuakeGuides;
