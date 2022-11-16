import Context from '../context';
import { SCREEN_SIZE } from '../maps/constants';

const results = [
  { name: 'Peter', scores: 300 },
  { name: 'Amelia', scores: 200 },
  { name: 'Oliver', scores: 100 }
];

export const renderGameOver = () => {
  const { graphicContext: ctx, scores } = Context.get();
  ctx.beginPath();
  ctx.font = 'bold 90px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#f44336';
  ctx.shadowBlur = 50;
  ctx.fillStyle = '#f44336';
  ctx.fillText('GAME OVER', 285, 150);
  ctx.rect(210, 500, 150, 40);
  ctx.fillStyle = '#f44336';
  ctx.fill();
  ctx.shadowColor = 'none';
  ctx.shadowBlur = 0;
  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RESTART', 285, 520);
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('Best scores:', 285, 250);
  ctx.font = 'bold 20px sans-serif';
  const records = [...results, { name: 'You', scores: scores }].sort(
    (a, b) => b.scores - a.scores
  );
  records.forEach((el, index) => {
    ctx.fillStyle = el.name === 'You' ? '#7b1fa2' : 'white';
    ctx.textAlign = 'left';
    ctx.fillText(`${index + 1}. ${el.name}`, 100, 320 + index * 40);
    ctx.textAlign = 'right';
    ctx.fillText(
      `${new Array(54 - el.name.length - el.scores.toString().length)
        .fill(null)
        .map(() => '.')
        .join('')} ${el.scores}`,
      SCREEN_SIZE - 100,
      320 + index * 40
    );
  });
  ctx.closePath();
};
