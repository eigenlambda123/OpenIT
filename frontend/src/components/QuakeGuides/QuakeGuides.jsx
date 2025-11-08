import {
  Flex,
  Heading,
} from '@chakra-ui/react';
import GuideEntry from './GuideEntry';

function QuakeGuides() {
  const guideData = [
    { id: 1, heading: '4.6', body: '45km', type: "do" },
    { id: 2, heading: '4.7', body: '45km', type: "do" },
    { id: 3, heading: '4.8', body: '45km', type: "do" },
    { id: 4, heading: '4.6', body: '45km', type: "dont" },
    { id: 5, heading: '4.7', body: '45km', type: "dont" },
    { id: 6, heading: '4.8', body: '45km', type: "dont" },
  ];

  return (
    <>
      <Flex direction="column" gap="10px">
        <Heading size={['sm', 'md']}>What To Do</Heading>
        <Flex direction="column">
          {guideData.filter(data => (data.type === "do")).map((data) => (
            <GuideEntry key={data.id} guideData={data} />
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" gap="10px">
        <Heading size={['sm', 'md']}>What Not To Do</Heading>
        <Flex direction="column">
          {guideData.filter(data => (data.type === "dont")).map(data => (
            <GuideEntry key={data.id} guideData={data} />
          ))}
        </Flex>
      </Flex>
    </>
  );
}

export default QuakeGuides;
