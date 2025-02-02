namespace mainApp.Tests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {
        // arrange
        var x = 1;
        var y = 2;

        // act
        var result = x + y;

        // assert
        Assert.Equal(3, result);

    }
}