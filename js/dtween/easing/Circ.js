function easeInCirc(t, b, c, d)
{
	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
}

function easeOutCirc(t, b, c, d)
{
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}

function easeInOutCirc(t, b, c, d)
{
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
}