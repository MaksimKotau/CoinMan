import Context from '../context';

export const renderStartNewLevel = () => {
    const { levelIndex, graphicContext: ctx } = Context.get();
    ctx.beginPath();
    ctx.rect(70, 185, 430, 200);
    ctx.fillStyle = 'purple';
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 50;
    ctx.fill();
    ctx.shadowColor = 'none';
    ctx.shadowBlur = 0;
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Level ${levelIndex + 1}`, 285, 270);
    ctx.closePath();
}