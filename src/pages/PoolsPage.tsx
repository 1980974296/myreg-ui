import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaSort } from 'react-icons/fa';
import Icon from '../components/tokens/Icon';
import { useTokens } from '../state/token';
import { Pool } from '../services/pool';
import { usePools } from '../state/pool';
import Loading from '../components/layout/Loading';
import PageWrap from '../components/layout/PageWrap';
import { calculateFeePercent, toRoundedReadableNumber } from '../utils/numbers';

function PoolRow({ pool }: { pool: Pool }) {
  const tokens = useTokens(pool.tokenIds);
  if (!tokens) return <Loading />;
  tokens.sort((a, b) => {
    if (a.symbol === 'wNEAR') return 1;
    if (b.symbol === 'wNEAR') return -1;
    return a.symbol > b.symbol ? 1 : -1;
  });

  const imgs = tokens.map((token, i) => (
    <Icon key={i} token={token} label={false} />
  ));

  return (
    <Link
      to={`/pools/${pool.id}`}
      className="grid grid-cols-12 py-2 text-right content-center"
    >
      <p className="grid grid-cols-2 col-span-1">{imgs}</p>
      <p className="grid col-span-4">
        {tokens[0].symbol}-{tokens[1].symbol}
      </p>
      <p className="col-span-5 text-center">
        {toRoundedReadableNumber({ decimals: 24, number: pool.shareSupply })}
      </p>
      <p className="col-span-2 text-center">{calculateFeePercent(pool.fee)}%</p>
    </Link>
  );
}

export default function PoolsPage() {
  const { pools, hasMore, nextPage, getPoolsList } = usePools();
  const [search, setSearch] = useState<string>('');
  const [sortState, setSortState] = useState<number>(0)
  const changeSort = () => {
    if (sortState === 0) {
      getPoolsList()
      console.log('从大到小')
    } else if (sortState === 1) {
      getPoolsList()
      console.log('从小到大')
    } else if (sortState === 2) {
      getPoolsList()
      console.log('无排序')
      setSortState(0)
      return
    }
    setSortState((sortState) => sortState + 1)
  }

  const handleChange = (message: any) => {
    setSearch(message);
  };
  const changePools = () => {
    getPoolsList(search);
  };
  if (!pools) return <Loading />;

  return (
    <>
      <PageWrap>
        <header className="grid grid-cols-6">
          <section>
            <div className="flex justify-center items-center border rounded p-2 bg-secondary">
              <input
                type="text"
                value={search}
                onChange={({ target }) => handleChange(target.value)}
                className="focus:outline-none text-inputText"/>
              <button className="hover:text-primaryScale-500 focus:outline-none" onClick={changePools}>
                <FaSearch />
              </button>
            </div>
          </section>
          <section className="col-span-4">
            <h1 className="text-xl font-bold p-2 text-center">
              Available Liquidity Pools
            </h1>
          </section>
          <section>
            <Link
              to="/pools/add"
              className="flex justify-center items-center border rounded p-2 bg-secondary hover:text-primaryScale-500"
            >
              <FaPlus />
              <span className="ml-2 text-right">Add Pool</span>
            </Link>
          </section>
        </header>

        <section>
          <header className="grid grid-cols-12 py-2 text-center">
            <p className="col-span-1 border-b-2 flex items-center justify-center">Pool</p>
            <p className="col-span-4 border-b-2 flex items-center justify-center"></p>
            <p className="col-span-5 border-b-2 flex items-center justify-center">Total Shares</p>
            <p className="col-span-2 border-b-2 flex items-center justify-center">Fee <FaSort className="cursor-pointer ml-1" onClick={changeSort}/></p>
          </header>
          {pools.map((pool) => (
            <PoolRow key={pool.id} pool={pool} />
          ))}
        </section>
        {hasMore && (
          <button
            className="bg-secondary border w-full p-2 mt-2"
            onClick={nextPage}
          >
            More
          </button>
        )}
      </PageWrap>
    </>
  );
}
