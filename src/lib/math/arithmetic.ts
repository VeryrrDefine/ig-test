import PowiainaNum from 'powiaina_num.js';

export function findNInArithmeticSequence(
	start: PowiainaNum,
	interval: PowiainaNum,
	goal: PowiainaNum,
): PowiainaNum {
	// 处理公差为0的特殊情况
	if (interval.eq(0)) {
		// 如果z等于x，返回0（在第一个区间内）
		// 否则返回-1表示不存在这样的n
		return goal === start ? PowiainaNum.ZERO : PowiainaNum.ONE.neg();
	}

	// 计算n的公式推导：
	// 条件：a_n <= z < a_{n+1}
	// 即：x + n*y <= z < x + (n+1)*y
	// 解不等式：n <= (z - x) / y < n + 1
	// 所以 n = floor((z - x) / y)

	const n = goal.sub(start).div(interval).floor();

	// 验证n是否满足条件
	if (n.gte(0)) {
		const a_n = start.add(n.mul(interval));
		const a_n_add_1 = start.add(n.add(1).mul(interval));

		// 检查z是否在[a_n, a_{n+1})区间内
		if (goal >= a_n && goal < a_n_add_1) {
			return n;
		}
	}

	// 如果没有找到合适的n，返回-1
	return PowiainaNum.ONE.neg();
}

export function f(n: PowiainaNum, start: PowiainaNum, interval: PowiainaNum): PowiainaNum {
	// f(n) = start*n + interval*(n*(n-1)/2)
	return start.mul(n).add(interval.mul(n).mul(n.sub(1)).div(2));
}

export function g(x: PowiainaNum, start: PowiainaNum, interval: PowiainaNum): PowiainaNum {
	// 特殊情况处理：当 interval 为 0 时，函数变为线性函数
	if (interval.eq(0)) {
		// g(x) = floor(x / start)
		return x.div(start).floor();
	}

	// 使用二次方程求根公式求解
	// f(n) = (interval/2)*n² + (start - interval/2)*n
	// 令 f(n) = x，得到：(interval/2)*n² + (start - interval/2)*n - x = 0

	const a = interval.div(2);
	const b = start.sub(interval.div(2));
	const c = x.neg(); // -x

	// 判别式: D = b² - 4*a*c
	const D = b.pow(2).sub(a.mul(c).mul(4));

	// 求根公式: n = [-b ± sqrt(D)] / (2*a)
	// 由于 n 必须是非负数，我们取正根
	const sqrtD = D.sqrt();
	const n1 = b.neg().add(sqrtD).div(a.mul(2));
	const n2 = b.neg().sub(sqrtD).div(a.mul(2));

	// 选择非负的根
	let candidate = n1.gte(0) ? n1 : n2;

	// 向下取整得到可能的 n 值
	let nFloor = candidate.floor();
	let nCeil = candidate.ceil();

	// 检查哪个 n 值满足 x ∈ [f(n), f(n+1))
	if (x.gte(f(nFloor, start, interval)) && x.lt(f(nFloor.add(1), start, interval))) {
		return nFloor;
	} else if (x.gte(f(nCeil, start, interval)) && x.lt(f(nCeil.add(1), start, interval))) {
		return nCeil;
	} else {
		// 如果上述都不满足，进行二分查找
		let left = new PowiainaNum(0);
		let right = candidate.add(1).ceil();

		while (left.lte(right)) {
			const mid = left.add(right).div(2).floor();
			const fMid = f(mid, start, interval);
			const fNext = f(mid.add(1), start, interval);

			if (x.gte(fMid) && x.lt(fNext)) {
				return mid;
			} else if (x.lt(fMid)) {
				right = mid.sub(1);
			} else {
				left = mid.add(1);
			}
		}

		// 理论上不会执行到这里
		return left;
	}
}
